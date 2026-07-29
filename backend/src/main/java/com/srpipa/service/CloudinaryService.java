package com.srpipa.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
    private static final Pattern PUBLIC_ID_PATTERN = Pattern.compile("/v\\d+/(.+)\\.\\w+$");

    private final Cloudinary cloudinary;
    private final boolean enabled;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret) {
        boolean cfgOk = !cloudName.isBlank() && !apiKey.isBlank() && !apiSecret.isBlank();
        this.enabled = cfgOk;
        if (cfgOk) {
            cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName.trim(),
                    "api_key", apiKey.trim(),
                    "api_secret", apiSecret.trim()
            ));
            log.info("Cloudinary configurado correctamente");
        } else {
            cloudinary = null;
            log.warn("Cloudinary NO configurado. Las subidas de imágenes no estarán disponibles.");
        }
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (!enabled) {
            throw new IOException("Cloudinary no está configurado");
        }
        Map<?, ?> params = ObjectUtils.asMap(
                "folder", folder,
                "use_filename", false,
                "unique_filename", true,
                "overwrite", true
        );
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), params);
        return result.get("secure_url").toString();
    }

    public void deleteImage(String imageUrl) {
        if (!enabled || imageUrl == null || imageUrl.isBlank()) return;
        String publicId = extractPublicId(imageUrl);
        if (publicId == null) return;
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Imagen eliminada de Cloudinary: {}", publicId);
        } catch (IOException e) {
            log.warn("No se pudo eliminar imagen de Cloudinary: {}", publicId, e);
        }
    }

    public boolean isEnabled() {
        return enabled;
    }

    private String extractPublicId(String imageUrl) {
        if (!imageUrl.contains("res.cloudinary.com")) return null;
        Matcher matcher = PUBLIC_ID_PATTERN.matcher(imageUrl);
        return matcher.find() ? matcher.group(1) : null;
    }
}

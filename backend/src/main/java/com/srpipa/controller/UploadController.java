package com.srpipa.controller;

import com.srpipa.service.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/upload")
public class UploadController {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final String FORMAT_PATTERN = "\\.(jpg|jpeg|png|gif|webp)$";

    private final CloudinaryService cloudinaryService;

    public UploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/producto")
    public ResponseEntity<String> uploadProducto(@RequestParam("file") MultipartFile file) {
        return upload(file, "srpipa/productos");
    }

    @PostMapping("/seccion")
    public ResponseEntity<String> uploadSeccion(@RequestParam("file") MultipartFile file) {
        return upload(file, "srpipa/secciones");
    }

    private ResponseEntity<String> upload(MultipartFile file, String folder) {
        if (!cloudinaryService.isEnabled()) {
            return ResponseEntity.badRequest().body("Cloudinary no configurado");
        }
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Archivo vacío");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body("El archivo excede el tamaño máximo de 5MB");
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().matches(".*" + FORMAT_PATTERN)) {
            return ResponseEntity.badRequest().body("Formato no soportado. Use: jpg, png, gif, webp");
        }
        try {
            String url = cloudinaryService.uploadImage(file, folder);
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al subir imagen: " + e.getMessage());
        }
    }
}

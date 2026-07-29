package com.srpipa.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/upload")
public class UploadController {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    @Value("${app.upload.productos:#{systemProperties['user.home'] + '/SrPipa/uploads/productos'}}")
    private String productosDir;

    @Value("${app.upload.secciones:#{systemProperties['user.home'] + '/SrPipa/uploads/secciones'}}")
    private String seccionesDir;

    @PostMapping("/producto")
    public ResponseEntity<String> uploadProducto(@RequestParam("file") MultipartFile file) {
        return saveFile(file, productosDir, "/uploads/productos/");
    }

    @PostMapping("/seccion")
    public ResponseEntity<String> uploadSeccion(@RequestParam("file") MultipartFile file) {
        return saveFile(file, seccionesDir, "/uploads/secciones/");
    }

    private ResponseEntity<String> saveFile(MultipartFile file, String dir, String urlPrefix) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Archivo vacío");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body("El archivo excede el tamaño máximo de 5MB");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            return ResponseEntity.badRequest().body("Nombre de archivo inválido");
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        if (!extension.matches("\\.(jpg|jpeg|png|gif|webp)")) {
            return ResponseEntity.badRequest().body("Formato no soportado. Use: jpg, png, gif, webp");
        }

        try {
            String filename = UUID.randomUUID() + extension;
            Path uploadPath = Paths.get(dir);
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(filename);
            file.transferTo(filePath.toFile());

            return ResponseEntity.ok(urlPrefix + filename);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al guardar archivo");
        }
    }
}

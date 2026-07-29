package com.srpipa.controller;

import com.srpipa.dto.SeccionDTO;
import com.srpipa.service.SeccionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/secciones")
public class AdminSeccionController {

    private final SeccionService seccionService;

    public AdminSeccionController(SeccionService seccionService) {
        this.seccionService = seccionService;
    }

    @GetMapping
    public ResponseEntity<List<SeccionDTO>> obtenerTodas() {
        return ResponseEntity.ok(seccionService.obtenerTodasLasSecciones());
    }

    @PostMapping
    public ResponseEntity<SeccionDTO> crear(@RequestBody @Valid SeccionDTO dto) {
        return ResponseEntity.ok(seccionService.crearSeccion(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeccionDTO> actualizar(@PathVariable Long id, @RequestBody @Valid SeccionDTO dto) {
        return ResponseEntity.ok(seccionService.actualizarSeccion(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SeccionDTO> actualizarParcial(@PathVariable Long id, @RequestBody Map<String, Object> campos) {
        return ResponseEntity.ok(seccionService.actualizarParcial(id, campos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        seccionService.eliminarSeccion(id);
        return ResponseEntity.noContent().build();
    }
}

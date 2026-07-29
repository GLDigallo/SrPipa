package com.srpipa.controller;

import com.srpipa.dto.ProductoDTO;
import com.srpipa.dto.SeccionDTO;
import com.srpipa.service.ProductoService;
import com.srpipa.service.SeccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secciones")
public class SeccionController {

    private final SeccionService seccionService;
    private final ProductoService productoService;

    public SeccionController(SeccionService seccionService, ProductoService productoService) {
        this.seccionService = seccionService;
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<SeccionDTO>> obtenerSecciones() {
        return ResponseEntity.ok(seccionService.obtenerSeccionesPublicas());
    }

    @GetMapping("/{id}/productos")
    public ResponseEntity<List<ProductoDTO>> productosPorSeccion(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerProductosPorSeccion(id));
    }
}

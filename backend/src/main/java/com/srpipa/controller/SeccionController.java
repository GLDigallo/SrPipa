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

    @GetMapping("/{slug}")
    public ResponseEntity<SeccionDTO> obtenerPorSlug(@PathVariable String slug) {
        return ResponseEntity.ok(seccionService.obtenerPorSlug(slug));
    }

    @GetMapping("/{slug}/productos")
    public ResponseEntity<List<ProductoDTO>> productosPorSeccion(@PathVariable String slug) {
        SeccionDTO seccion = seccionService.obtenerPorSlug(slug);
        return ResponseEntity.ok(productoService.obtenerProductosPorSeccion(seccion.id()));
    }
}

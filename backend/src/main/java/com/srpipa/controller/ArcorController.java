package com.srpipa.controller;

import com.srpipa.dto.ArcorProducto;
import com.srpipa.service.ArcorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/arcor")
public class ArcorController {

    private final ArcorService arcorService;

    public ArcorController(ArcorService arcorService) {
        this.arcorService = arcorService;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ArcorProducto>> buscar(
            @RequestParam String q,
            @RequestParam(required = false) Integer limite) {
        int limit = limite != null ? limite : 100;
        return ResponseEntity.ok(arcorService.buscar(q, limit));
    }

    @GetMapping("/categoria/{id}")
    public ResponseEntity<List<ArcorProducto>> buscarPorCategoria(
            @PathVariable Long id,
            @RequestParam(defaultValue = "10") int limite) {
        return ResponseEntity.ok(arcorService.buscarPorCategoria(id, limite));
    }
}

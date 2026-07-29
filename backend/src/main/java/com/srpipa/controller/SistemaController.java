package com.srpipa.controller;

import com.srpipa.dto.SistemaResponse;
import com.srpipa.service.SistemaService;
import com.srpipa.service.SyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/sistema")
public class SistemaController {

    private final SistemaService sistemaService;
    private final SyncService syncService;

    public SistemaController(SistemaService sistemaService, SyncService syncService) {
        this.sistemaService = sistemaService;
        this.syncService = syncService;
    }

    @GetMapping
    public ResponseEntity<SistemaResponse> obtenerEstado() {
        return ResponseEntity.ok(sistemaService.obtenerEstado());
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> sincronizar() {
        syncService.ejecutarSync();
        return ResponseEntity.ok(Map.of(
                "mensaje", "Sincronización completada",
                "nuevos", syncService.getProductosNuevos(),
                "actualizados", syncService.getProductosActualizados(),
                "errores", syncService.getErrores()
        ));
    }
}

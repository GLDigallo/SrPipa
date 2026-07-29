package com.srpipa.controller;

import com.srpipa.dto.ConsultaDTO;
import com.srpipa.dto.ConsultaRequest;
import com.srpipa.service.ConsultaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ConsultaController {

    private final ConsultaService consultaService;

    public ConsultaController(ConsultaService consultaService) {
        this.consultaService = consultaService;
    }

    @PostMapping("/consultas")
    public ResponseEntity<ConsultaDTO> crear(@RequestBody @Valid ConsultaRequest request) {
        return ResponseEntity.ok(consultaService.crear(request));
    }

    @GetMapping("/admin/consultas")
    public ResponseEntity<List<ConsultaDTO>> listar() {
        return ResponseEntity.ok(consultaService.listarTodas());
    }

    @GetMapping("/admin/consultas/cliente/{clienteId}")
    public ResponseEntity<List<ConsultaDTO>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(consultaService.listarPorCliente(clienteId));
    }

    @GetMapping("/admin/consultas/{id}")
    public ResponseEntity<ConsultaDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.obtenerPorId(id));
    }

    @PatchMapping("/admin/consultas/{id}/confirmar")
    public ResponseEntity<Void> confirmarConsulta(@PathVariable Long id) {
        consultaService.confirmarConsulta(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/consultas/{id}/cancelar")
    public ResponseEntity<Void> cancelarConsulta(@PathVariable Long id) {
        consultaService.cancelarConsulta(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/consultas/productos/{productoConsultaId}/confirmar")
    public ResponseEntity<Void> confirmarProducto(
            @PathVariable Long productoConsultaId,
            @RequestBody Map<String, Integer> body) {
        int cantidad = body.getOrDefault("cantidad", 1);
        consultaService.confirmarProducto(productoConsultaId, cantidad);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/consultas/productos/{productoConsultaId}/denegar")
    public ResponseEntity<Void> denegarProducto(@PathVariable Long productoConsultaId) {
        consultaService.denegarProducto(productoConsultaId);
        return ResponseEntity.noContent().build();
    }
}

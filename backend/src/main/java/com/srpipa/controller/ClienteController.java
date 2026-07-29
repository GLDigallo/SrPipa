package com.srpipa.controller;

import com.srpipa.dto.ClienteDTO;
import com.srpipa.dto.ProductoRankingDTO;
import com.srpipa.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ClienteDTO>> buscar(@RequestParam String q) {
        return ResponseEntity.ok(clienteService.buscar(q));
    }

    @GetMapping("/{id}/ranking")
    public ResponseEntity<List<ProductoRankingDTO>> ranking(
            @PathVariable Long id,
            @RequestParam(defaultValue = "5") int limite) {
        return ResponseEntity.ok(clienteService.rankingProductos(id, limite));
    }
}

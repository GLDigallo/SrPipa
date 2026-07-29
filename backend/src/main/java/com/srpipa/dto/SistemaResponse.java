package com.srpipa.dto;

import java.time.LocalDateTime;
import java.util.List;

public record SistemaResponse(
    long totalProductos,
    long productosDisponibles,
    long productosSinStock,
    long productosOcultos,
    long productosSinImagen,
    long totalCategorias,
    long totalSecciones,
    List<ProductoRecienteDTO> productosRecientes
) {
    public record ProductoRecienteDTO(
        Long id,
        String nombre,
        String categoria,
        Integer stock,
        LocalDateTime fechaActualizacion
    ) {}
}

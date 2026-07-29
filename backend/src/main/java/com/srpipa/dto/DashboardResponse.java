package com.srpipa.dto;

public record DashboardResponse(
    long totalProductos,
    long productosDisponibles,
    long productosSinStock,
    long productosOcultos
) {}

package com.srpipa.dto;

public record SeccionDTO(
    Long id,
    String nombre,
    String color,
    String imagen,
    Integer orden,
    boolean activa,
    int cantidadProductos
) {
}

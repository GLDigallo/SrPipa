package com.srpipa.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoriaDTO(
    Long id,
    @NotBlank(message = "El nombre es obligatorio") String nombre,
    String descripcion,
    String imagen,
    Integer orden,
    boolean activa,
    int cantidadProductos
) {
    public CategoriaDTO(Long id, String nombre, String descripcion, String imagen,
                        Integer orden, boolean activa) {
        this(id, nombre, descripcion, imagen, orden, activa, 0);
    }
}

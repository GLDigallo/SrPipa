package com.srpipa.dto;

public record ClienteDTO(
    Long id,
    String telefono,
    String nombre,
    java.time.LocalDateTime fechaCreacion
) {}

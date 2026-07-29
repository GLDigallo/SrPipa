package com.srpipa.dto;

import java.util.List;

public record ArcorProducto(
    Long id,
    String nombre,
    String imagenUrl,
    List<String> categorias,
    String permalink
) {}

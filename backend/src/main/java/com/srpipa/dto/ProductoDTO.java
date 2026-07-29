package com.srpipa.dto;

import java.math.BigDecimal;

public record ProductoDTO(
    Long id,
    String nombre,
    BigDecimal precio,
    String imagen,
    Long categoriaId,
    String categoriaNombre,
    Long seccionId,
    String seccionNombre,
    Integer stock,
    String providerName,
    Long providerId,
    String providerUrl
) {}

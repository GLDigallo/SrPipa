package com.srpipa.dto;

public record ProductoRankingDTO(
    Long productoId,
    String productoNombre,
    int vecesConfirmado,
    int unidadesConfirmadas
) {}

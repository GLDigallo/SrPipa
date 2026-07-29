package com.srpipa.provider;

public record SyncedProduct(
    Long providerId,
    String nombre,
    String imagenUrl,
    String providerUrl,
    Long categoriaProviderId,
    String categoriaNombre
) {}

package com.srpipa.dto;

public record LoginResponse(
    String token,
    String tipo,
    String username,
    String rol
) {}

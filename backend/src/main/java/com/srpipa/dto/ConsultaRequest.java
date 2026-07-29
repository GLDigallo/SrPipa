package com.srpipa.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ConsultaRequest(
    @NotBlank(message = "El nombre del cliente es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    String clienteNombre,

    @NotBlank(message = "El teléfono del cliente es obligatorio")
    @Size(max = 20, message = "El teléfono no puede superar 20 caracteres")
    String clienteTelefono,

    @NotEmpty(message = "Debe incluir al menos un producto")
    @Valid
    List<ProductoItem> productos
) {
    public record ProductoItem(
        Long productoId,
        int cantidad
    ) {}
}

package com.srpipa.dto;

import java.util.List;

public record ConsultaDTO(
    Long id,
    String clienteNombre,
    String clienteTelefono,
    String estado,
    List<ProductoConsultaDTO> productos,
    int totalProductos,
    int productosConfirmados,
    int productosDenegados,
    java.time.LocalDateTime fechaCreacion,
    java.time.LocalDateTime fechaActualizacion
) {
    public record ProductoConsultaDTO(
        Long productoConsultaId,
        Long productoId,
        String productoNombre,
        int cantidadSolicitada,
        int cantidadVendida,
        int stockActual,
        boolean confirmada,
        boolean denegada
    ) {}
}

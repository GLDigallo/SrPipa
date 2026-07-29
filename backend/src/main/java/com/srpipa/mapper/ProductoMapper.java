package com.srpipa.mapper;

import com.srpipa.dto.ProductoDTO;
import com.srpipa.entity.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public ProductoDTO toDTO(Producto producto) {
        return new ProductoDTO(
            producto.getId(),
            producto.getNombre(),
            producto.getPrecio(),
            producto.getImagen(),
            producto.getCategoria() != null ? producto.getCategoria().getId() : null,
            producto.getCategoria() != null ? producto.getCategoria().getNombre() : null,
            producto.getSeccion() != null ? producto.getSeccion().getId() : null,
            producto.getSeccion() != null ? producto.getSeccion().getNombre() : null,
            producto.getStock(),
            producto.getProviderName(),
            producto.getProviderId(),
            producto.getProviderUrl()
        );
    }
}

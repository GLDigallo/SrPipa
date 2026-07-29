package com.srpipa.mapper;

import com.srpipa.dto.CategoriaDTO;
import com.srpipa.entity.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public CategoriaDTO toDTO(Categoria categoria) {
        return toDTO(categoria, 0);
    }

    public CategoriaDTO toDTO(Categoria categoria, int cantidadProductos) {
        return new CategoriaDTO(
            categoria.getId(),
            categoria.getNombre(),
            categoria.getDescripcion(),
            categoria.getImagen(),
            categoria.getOrden(),
            categoria.isActiva(),
            cantidadProductos
        );
    }
}

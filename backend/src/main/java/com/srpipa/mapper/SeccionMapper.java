package com.srpipa.mapper;

import com.srpipa.dto.SeccionDTO;
import com.srpipa.entity.Seccion;
import org.springframework.stereotype.Component;

@Component
public class SeccionMapper {

    public SeccionDTO toDTO(Seccion seccion) {
        return toDTO(seccion, 0);
    }

    public SeccionDTO toDTO(Seccion seccion, int cantidadProductos) {
        return new SeccionDTO(
            seccion.getId(),
            seccion.getNombre(),
            seccion.getSlug(),
            seccion.getColor(),
            seccion.getImagen(),
            seccion.getOrden(),
            seccion.isActiva(),
            cantidadProductos
        );
    }
}

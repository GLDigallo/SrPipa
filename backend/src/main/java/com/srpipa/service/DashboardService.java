package com.srpipa.service;

import com.srpipa.dto.DashboardResponse;
import com.srpipa.entity.EstadoProducto;
import com.srpipa.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final ProductoRepository productoRepository;

    public DashboardService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse obtenerResumen() {
        long total = productoRepository.count();
        long disponibles = productoRepository.countByEstado(EstadoProducto.DISPONIBLE);
        long sinStock = productoRepository.countByEstado(EstadoProducto.SIN_STOCK);
        long ocultos = productoRepository.countByEstado(EstadoProducto.OCULTO);

        return new DashboardResponse(total, disponibles, sinStock, ocultos);
    }
}

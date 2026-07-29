package com.srpipa.service;

import com.srpipa.dto.SistemaResponse;
import com.srpipa.entity.EstadoProducto;
import com.srpipa.repository.CategoriaRepository;
import com.srpipa.repository.ProductoRepository;
import com.srpipa.repository.SeccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SistemaService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SeccionRepository seccionRepository;

    public SistemaService(ProductoRepository productoRepository,
                          CategoriaRepository categoriaRepository,
                          SeccionRepository seccionRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.seccionRepository = seccionRepository;
    }

    @Transactional(readOnly = true)
    public SistemaResponse obtenerEstado() {
        long total = productoRepository.count();
        long disponibles = productoRepository.countByEstado(EstadoProducto.DISPONIBLE);
        long sinStock = productoRepository.countByEstado(EstadoProducto.SIN_STOCK);
        long ocultos = productoRepository.countByEstado(EstadoProducto.OCULTO);
        long sinImagen = productoRepository.countByImagenIsNullOrImagen("");
        long totalCategorias = categoriaRepository.count();
        long totalSecciones = seccionRepository.count();

        List<SistemaResponse.ProductoRecienteDTO> recientes = productoRepository
                .findTop10ByOrderByFechaActualizacionDesc()
                .stream()
                .map(p -> new SistemaResponse.ProductoRecienteDTO(
                        p.getId(),
                        p.getNombre(),
                        p.getCategoria() != null ? p.getCategoria().getNombre() : null,
                        p.getStock(),
                        p.getFechaActualizacion()
                ))
                .toList();

        return new SistemaResponse(
                total, disponibles, sinStock, ocultos,
                sinImagen, totalCategorias, totalSecciones, recientes
        );
    }
}

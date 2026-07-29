package com.srpipa.service;

import com.srpipa.dto.ProductoDTO;
import com.srpipa.entity.Categoria;
import com.srpipa.entity.EstadoProducto;
import com.srpipa.entity.Producto;
import com.srpipa.entity.Seccion;
import com.srpipa.mapper.ProductoMapper;
import com.srpipa.repository.CategoriaRepository;
import com.srpipa.repository.ProductoRepository;
import com.srpipa.repository.SeccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SeccionRepository seccionRepository;
    private final ProductoMapper productoMapper;

    public ProductoService(ProductoRepository productoRepository,
                          CategoriaRepository categoriaRepository,
                          SeccionRepository seccionRepository,
                          ProductoMapper productoMapper) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.seccionRepository = seccionRepository;
        this.productoMapper = productoMapper;
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerProductosPublicos() {
        return productoRepository.findByEstadoOrderByNombreAsc(EstadoProducto.DISPONIBLE)
                .stream()
                .filter(p -> p.getStock() != null && p.getStock() > 0)
                .map(productoMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerProductosPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaIdAndEstado(categoriaId, EstadoProducto.DISPONIBLE)
                .stream()
                .filter(p -> p.getStock() != null && p.getStock() > 0)
                .map(productoMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerProductosPorSeccion(Long seccionId) {
        return productoRepository.findBySeccionIdAndEstado(seccionId, EstadoProducto.DISPONIBLE)
                .stream()
                .filter(p -> p.getStock() != null && p.getStock() > 0)
                .map(productoMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> buscarProductos(String busqueda) {
        return productoRepository.buscarPorNombre(busqueda, EstadoProducto.DISPONIBLE)
                .stream()
                .filter(p -> p.getStock() != null && p.getStock() > 0)
                .map(productoMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> filtrarProductosAdmin(Long categoriaId, String estado, String busqueda) {
        EstadoProducto estadoEnum = null;
        if (estado != null && !estado.isBlank()) {
            try {
                estadoEnum = EstadoProducto.valueOf(estado);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Estado inválido: " + estado);
            }
        }
        List<Producto> productos = productoRepository.filtrarProductos(categoriaId, estadoEnum);

        if (busqueda != null && !busqueda.isBlank()) {
            String busquedaLower = busqueda.toLowerCase();
            productos = productos.stream()
                    .filter(p -> p.getNombre() != null && p.getNombre().toLowerCase().contains(busquedaLower))
                    .toList();
        }

        return productos.stream()
                .map(productoMapper::toDTO)
                .toList();
    }

    @Transactional
    public ProductoDTO crearProducto(ProductoDTO dto) {
        Producto producto = new Producto(dto.nombre(), dto.precio(), dto.imagen());
        producto.setStock(dto.stock() != null ? dto.stock() : 0);
        producto.setEstado(calcularEstado(producto.getStock()));

        if (dto.categoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoria(categoria);
        }

        if (dto.seccionId() != null) {
            Seccion seccion = seccionRepository.findById(dto.seccionId())
                    .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
            producto.setSeccion(seccion);
        }

        Producto guardado = productoRepository.save(producto);
        return productoMapper.toDTO(guardado);
    }

    @Transactional
    public ProductoDTO actualizarProducto(Long id, ProductoDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setNombre(dto.nombre());
        producto.setPrecio(dto.precio());
        producto.setImagen(dto.imagen());
        producto.setStock(dto.stock() != null ? dto.stock() : 0);
        producto.setEstado(calcularEstado(producto.getStock()));

        if (dto.categoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoria(categoria);
        } else {
            producto.setCategoria(null);
        }

        if (dto.seccionId() != null) {
            Seccion seccion = seccionRepository.findById(dto.seccionId())
                    .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
            producto.setSeccion(seccion);
        } else {
            producto.setSeccion(null);
        }

        Producto actualizado = productoRepository.save(producto);
        return productoMapper.toDTO(actualizado);
    }

    @Transactional
    public ProductoDTO actualizarStock(Long id, Integer nuevoStock) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setStock(nuevoStock != null ? nuevoStock : 0);
        producto.setEstado(calcularEstado(producto.getStock()));

        Producto actualizado = productoRepository.save(producto);
        return productoMapper.toDTO(actualizado);
    }

    @Transactional
    public ProductoDTO cambiarEstado(Long id, String nuevoEstado) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        EstadoProducto estado;
        try {
            estado = EstadoProducto.valueOf(nuevoEstado);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + nuevoEstado);
        }
        producto.setEstado(estado);

        Producto actualizado = productoRepository.save(producto);
        return productoMapper.toDTO(actualizado);
    }

    @Transactional
    public void eliminarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        productoRepository.delete(producto);
    }

    private EstadoProducto calcularEstado(int stock) {
        return stock > 0 ? EstadoProducto.DISPONIBLE : EstadoProducto.SIN_STOCK;
    }
}

package com.srpipa.service;

import com.srpipa.dto.CategoriaDTO;
import com.srpipa.entity.Categoria;
import com.srpipa.mapper.CategoriaMapper;
import com.srpipa.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    public CategoriaService(CategoriaRepository categoriaRepository, CategoriaMapper categoriaMapper) {
        this.categoriaRepository = categoriaRepository;
        this.categoriaMapper = categoriaMapper;
    }

    @Transactional(readOnly = true)
    public List<CategoriaDTO> obtenerCategoriasManuales() {
        return categoriaRepository.findByManualTrueOrderByNombreAsc()
                .stream()
                .map(c -> categoriaMapper.toDTO(c))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoriaDTO> obtenerCategoriasPublicas() {
        return categoriaRepository.findByActivaTrueOrderByOrdenAsc()
                .stream()
                .map(c -> categoriaMapper.toDTO(c))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoriaDTO> obtenerTodasLasCategorias() {
        List<Categoria> categorias = categoriaRepository.findAllByOrderByOrdenAsc();
        Map<Long, Integer> conteos = categoriaRepository.countProductosByCategoria()
                .stream()
                .collect(Collectors.toMap(
                    row -> (Long) row[0],
                    row -> ((Long) row[1]).intValue()
                ));
        return categorias.stream()
                .map(c -> categoriaMapper.toDTO(c, conteos.getOrDefault(c.getId(), 0)))
                .toList();
    }

    @Transactional
    public CategoriaDTO crearCategoria(CategoriaDTO dto) {
        Categoria categoria = new Categoria(dto.nombre(), dto.descripcion(), dto.orden());
        Categoria guardada = categoriaRepository.save(categoria);
        return categoriaMapper.toDTO(guardada);
    }

    @Transactional
    public CategoriaDTO actualizarCategoria(Long id, CategoriaDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        categoria.setNombre(dto.nombre());
        categoria.setDescripcion(dto.descripcion());
        categoria.setImagen(dto.imagen());
        categoria.setOrden(dto.orden());
        categoria.setActiva(dto.activa());
        Categoria actualizada = categoriaRepository.save(categoria);
        return categoriaMapper.toDTO(actualizada);
    }

    @Transactional
    public void eliminarCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        categoriaRepository.delete(categoria);
    }
}

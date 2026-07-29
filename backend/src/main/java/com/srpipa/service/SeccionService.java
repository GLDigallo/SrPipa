package com.srpipa.service;

import com.srpipa.dto.SeccionDTO;
import com.srpipa.entity.Seccion;
import com.srpipa.mapper.SeccionMapper;
import com.srpipa.repository.SeccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SeccionService {

    private static final Set<String> CAMPOS_PERMITIDOS = Set.of("nombre", "color", "imagen", "orden", "activa");

    private final SeccionRepository seccionRepository;
    private final SeccionMapper seccionMapper;

    public SeccionService(SeccionRepository seccionRepository, SeccionMapper seccionMapper) {
        this.seccionRepository = seccionRepository;
        this.seccionMapper = seccionMapper;
    }

    @Transactional(readOnly = true)
    public List<SeccionDTO> obtenerSeccionesPublicas() {
        List<Seccion> secciones = seccionRepository.findByActivaTrueOrderByOrdenAsc();
        Map<Long, Integer> conteos = seccionRepository.countProductosBySeccion()
                .stream()
                .collect(Collectors.toMap(
                    row -> (Long) row[0],
                    row -> ((Long) row[1]).intValue()
                ));
        return secciones.stream()
                .map(s -> seccionMapper.toDTO(s, conteos.getOrDefault(s.getId(), 0)))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SeccionDTO> obtenerTodasLasSecciones() {
        List<Seccion> secciones = seccionRepository.findAllByOrderByOrdenAsc();
        Map<Long, Integer> conteos = seccionRepository.countProductosBySeccion()
                .stream()
                .collect(Collectors.toMap(
                    row -> (Long) row[0],
                    row -> ((Long) row[1]).intValue()
                ));
        return secciones.stream()
                .map(s -> seccionMapper.toDTO(s, conteos.getOrDefault(s.getId(), 0)))
                .toList();
    }

    @Transactional
    public SeccionDTO crearSeccion(SeccionDTO dto) {
        Seccion seccion = new Seccion(dto.nombre(), dto.orden());
        seccion.setColor(dto.color());
        seccion.setImagen(dto.imagen());
        Seccion guardada = seccionRepository.save(seccion);
        return seccionMapper.toDTO(guardada);
    }

    @Transactional
    public SeccionDTO actualizarSeccion(Long id, SeccionDTO dto) {
        Seccion seccion = seccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
        seccion.setNombre(dto.nombre());
        seccion.setColor(dto.color());
        seccion.setImagen(dto.imagen());
        seccion.setOrden(dto.orden());
        seccion.setActiva(dto.activa());
        Seccion actualizada = seccionRepository.save(seccion);
        return seccionMapper.toDTO(actualizada);
    }

    @Transactional
    public SeccionDTO actualizarParcial(Long id, Map<String, Object> campos) {
        Seccion seccion = seccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
        for (String campo : campos.keySet()) {
            if (!CAMPOS_PERMITIDOS.contains(campo)) continue;
            Object valor = campos.get(campo);
            switch (campo) {
                case "nombre" -> seccion.setNombre((String) valor);
                case "color" -> seccion.setColor((String) valor);
                case "imagen" -> seccion.setImagen((String) valor);
                case "orden" -> {
                    if (valor instanceof Number n) seccion.setOrden(n.intValue());
                    else throw new RuntimeException("El orden debe ser numérico");
                }
                case "activa" -> {
                    if (valor instanceof Boolean b) seccion.setActiva(b);
                    else throw new RuntimeException("El campo activa debe ser booleano");
                }
            }
        }
        Seccion actualizada = seccionRepository.save(seccion);
        return seccionMapper.toDTO(actualizada);
    }

    @Transactional
    public void eliminarSeccion(Long id) {
        Seccion seccion = seccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
        seccionRepository.delete(seccion);
    }
}

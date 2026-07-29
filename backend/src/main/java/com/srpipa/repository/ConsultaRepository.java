package com.srpipa.repository;

import com.srpipa.entity.Consulta;
import com.srpipa.entity.EstadoConsulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByEstadoOrderByFechaActualizacionDesc(EstadoConsulta estado);
    List<Consulta> findAllByOrderByFechaActualizacionDesc();
    long countByEstado(EstadoConsulta estado);
    List<Consulta> findByClienteId(Long clienteId);
    List<Consulta> findByClienteIdOrderByFechaActualizacionDesc(Long clienteId);
}

package com.srpipa.repository;

import com.srpipa.entity.ConsultaProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultaProductoRepository extends JpaRepository<ConsultaProducto, Long> {
    List<ConsultaProducto> findByConsultaId(Long consultaId);
}

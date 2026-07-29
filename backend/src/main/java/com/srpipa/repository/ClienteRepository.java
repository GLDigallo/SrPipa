package com.srpipa.repository;

import com.srpipa.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByTelefono(String telefono);

    @Query("SELECT c FROM Cliente c WHERE c.telefono LIKE %:q% OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%')) ORDER BY c.nombre")
    List<Cliente> buscar(@Param("q") String q);
}

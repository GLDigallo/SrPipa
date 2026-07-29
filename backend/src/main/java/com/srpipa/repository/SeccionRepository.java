package com.srpipa.repository;

import com.srpipa.entity.Seccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeccionRepository extends JpaRepository<Seccion, Long> {
    List<Seccion> findByActivaTrueOrderByOrdenAsc();
    List<Seccion> findAllByOrderByOrdenAsc();
    Optional<Seccion> findBySlug(String slug);
    Optional<Seccion> findBySlugAndActivaTrue(String slug);

    @Query("SELECT s.id, COUNT(p.id) FROM Seccion s LEFT JOIN s.productos p GROUP BY s.id")
    List<Object[]> countProductosBySeccion();
}

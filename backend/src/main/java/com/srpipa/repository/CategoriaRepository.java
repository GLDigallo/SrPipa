package com.srpipa.repository;

import com.srpipa.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByActivaTrueOrderByOrdenAsc();
    List<Categoria> findAllByOrderByOrdenAsc();
    List<Categoria> findByManualTrueOrderByNombreAsc();
    Optional<Categoria> findByNombreIgnoreCase(String nombre);

    @Query("SELECT c.id, COUNT(p.id) FROM Categoria c LEFT JOIN c.productos p GROUP BY c.id")
    List<Object[]> countProductosByCategoria();
}

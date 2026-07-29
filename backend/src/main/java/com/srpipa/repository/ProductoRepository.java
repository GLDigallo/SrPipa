package com.srpipa.repository;

import com.srpipa.entity.EstadoProducto;
import com.srpipa.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByEstado(EstadoProducto estado);
    List<Producto> findByCategoriaIdAndEstado(Long categoriaId, EstadoProducto estado);
    List<Producto> findByEstadoOrderByNombreAsc(EstadoProducto estado);
    List<Producto> findBySeccionIdAndEstado(Long seccionId, EstadoProducto estado);

    @Query("SELECT p FROM Producto p WHERE p.estado = :estado AND " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')))")
    List<Producto> buscarPorNombre(@Param("busqueda") String busqueda,
                                   @Param("estado") EstadoProducto estado);

    @Query("SELECT p FROM Producto p WHERE " +
           "(:categoriaId IS NULL OR p.categoria.id = :categoriaId) AND " +
           "(:estado IS NULL OR p.estado = :estado)")
    List<Producto> filtrarProductos(@Param("categoriaId") Long categoriaId,
                                    @Param("estado") EstadoProducto estado);

    long countByEstado(EstadoProducto estado);

    Optional<Producto> findByProviderNameAndProviderId(String providerName, Long providerId);

    Optional<Producto> findByNombreIgnoreCase(String nombre);

    long countByProviderNameIsNotNull();

    long countByProviderNameIsNull();

    long countByImagenIsNullOrImagen(String empty);

    long countByStock(Integer stock);

    long countByPrecio(java.math.BigDecimal precio);

    @Query("SELECT p.providerName, COUNT(p) FROM Producto p WHERE p.providerName IS NOT NULL GROUP BY p.providerName")
    List<Object[]> countByProviderGroup();

    List<Producto> findTop10ByOrderByFechaActualizacionDesc();
}

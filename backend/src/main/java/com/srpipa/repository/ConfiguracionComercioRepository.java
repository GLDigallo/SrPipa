package com.srpipa.repository;

import com.srpipa.entity.ConfiguracionComercio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfiguracionComercioRepository extends JpaRepository<ConfiguracionComercio, Long> {
    Optional<ConfiguracionComercio> findFirstByOrderByIdAsc();
}

package com.srpipa.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "secciones")
@Getter
@Setter
@NoArgsConstructor
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(unique = true, length = 150)
    private String slug;

    @Column(length = 7)
    private String color;

    @Column(length = 500)
    private String imagen;

    @Column(nullable = false)
    private Integer orden;

    @Column(nullable = false)
    private boolean activa;

    @OneToMany(mappedBy = "seccion", fetch = FetchType.LAZY)
    private List<Producto> productos = new ArrayList<>();

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public Seccion(String nombre, Integer orden) {
        this.nombre = nombre;
        this.orden = orden;
    }

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
        activa = true;
        if (orden == null) {
            orden = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}

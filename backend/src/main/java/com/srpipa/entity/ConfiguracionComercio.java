package com.srpipa.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "configuracion_comercio")
@Getter
@Setter
@NoArgsConstructor
public class ConfiguracionComercio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_comercio", nullable = false)
    private String nombreComercio;

    @Column(name = "whatsapp_numero", nullable = false)
    private String whatsappNumero;

    @Column(name = "horario_apertura", nullable = false)
    private LocalTime horarioApertura;

    @Column(name = "horario_cierre", nullable = false)
    private LocalTime horarioCierre;

    private String logo;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public ConfiguracionComercio(String nombreComercio, String whatsappNumero,
                                  LocalTime horarioApertura, LocalTime horarioCierre) {
        this.nombreComercio = nombreComercio;
        this.whatsappNumero = whatsappNumero;
        this.horarioApertura = horarioApertura;
        this.horarioCierre = horarioCierre;
    }

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}

package com.srpipa.service;

import com.srpipa.entity.EstadoProducto;
import com.srpipa.entity.Producto;
import com.srpipa.provider.ProductProvider;
import com.srpipa.provider.SyncedProduct;
import com.srpipa.repository.ProductoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SyncService {

    private static final Logger log = LoggerFactory.getLogger(SyncService.class);

    private final List<ProductProvider> providers;
    private final ProductoRepository productoRepository;

    private LocalDateTime ultimaSync = null;
    private long productosSincronizados = 0;
    private long productosNuevos = 0;
    private long productosActualizados = 0;
    private long errores = 0;
    private String estadoSync = "Pendiente";
    private String ultimoLog = "";

    public SyncService(List<ProductProvider> providers,
                       ProductoRepository productoRepository) {
        this.providers = providers;
        this.productoRepository = productoRepository;
    }

    @Scheduled(cron = "0 0 6 ? * MON")
    public void syncSemanal() {
        log.info("Starting weekly sync...");
        ejecutarSync();
    }

    @Transactional
    public void ejecutarSync() {
        estadoSync = "En progreso";
        productosNuevos = 0;
        productosActualizados = 0;
        errores = 0;
        productosSincronizados = 0;

        for (ProductProvider provider : providers) {
            try {
                syncProvider(provider);
            } catch (Exception e) {
                log.error("Error syncing provider {}: {}", provider.getProviderName(), e.getMessage());
                errores++;
            }
        }

        ultimaSync = LocalDateTime.now();
        estadoSync = errores > 0 ? "Completado con errores" : "OK";
        ultimoLog = String.format("Nuevos: %d, Actualizados: %d, Errores: %d",
                productosNuevos, productosActualizados, errores);

        log.info("Sync completed: {}", ultimoLog);
    }

    private void syncProvider(ProductProvider provider) {
        String providerName = provider.getProviderName();
        List<SyncedProduct> externos = provider.fetchAll();
        productosSincronizados = externos.size();

        for (SyncedProduct ext : externos) {
            try {
                Optional<Producto> existente = productoRepository
                        .findByProviderNameAndProviderId(providerName, ext.providerId());

                if (existente.isPresent()) {
                    actualizarDesdeProveedor(existente.get(), ext);
                    productosActualizados++;
                } else {
                    crearDesdeProveedor(ext, providerName);
                    productosNuevos++;
                }
            } catch (Exception e) {
                log.error("Error syncing product {} from {}: {}", ext.providerId(), providerName, e.getMessage());
                errores++;
            }
        }
    }

    private void actualizarDesdeProveedor(Producto p, SyncedProduct ext) {
        boolean changed = false;

        if (!p.getNombre().equals(ext.nombre())) {
            p.setNombre(ext.nombre());
            changed = true;
        }
        if (ext.imagenUrl() != null && !ext.imagenUrl().isBlank()
                && !ext.imagenUrl().equals(p.getImagen())) {
            p.setImagen(ext.imagenUrl());
            changed = true;
        }
        if (ext.providerUrl() != null && !ext.providerUrl().equals(p.getProviderUrl())) {
            p.setProviderUrl(ext.providerUrl());
            changed = true;
        }

        if (changed) {
            p.setUltimaSync(LocalDateTime.now());
            productoRepository.save(p);
        }
    }

    private void crearDesdeProveedor(SyncedProduct ext, String providerName) {
        if (ext.nombre() == null || ext.nombre().isBlank()) return;

        Producto producto = new Producto(ext.nombre(), BigDecimal.ZERO, ext.imagenUrl());
        producto.setStock(0);
        producto.setEstado(EstadoProducto.DISPONIBLE);
        producto.setProviderName(providerName);
        producto.setProviderId(ext.providerId());
        producto.setProviderUrl(ext.providerUrl());
        producto.setUltimaSync(LocalDateTime.now());

        productoRepository.save(producto);
    }

    public LocalDateTime getUltimaSync() { return ultimaSync; }
    public long getProductosSincronizados() { return productosSincronizados; }
    public long getProductosNuevos() { return productosNuevos; }
    public long getProductosActualizados() { return productosActualizados; }
    public long getErrores() { return errores; }
    public String getEstadoSync() { return estadoSync; }
    public String getUltimoLog() { return ultimoLog; }
    public List<String> getProveedores() {
        return providers.stream().map(ProductProvider::getProviderName).toList();
    }
}

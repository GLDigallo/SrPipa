package com.srpipa.service;

import com.srpipa.dto.ConsultaDTO;
import com.srpipa.dto.ConsultaRequest;
import com.srpipa.entity.*;
import com.srpipa.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final ConsultaProductoRepository consultaProductoRepository;
    private final ProductoRepository productoRepository;
    private final ClienteService clienteService;

    public ConsultaService(ConsultaRepository consultaRepository,
                           ConsultaProductoRepository consultaProductoRepository,
                           ProductoRepository productoRepository,
                           ClienteService clienteService) {
        this.consultaRepository = consultaRepository;
        this.consultaProductoRepository = consultaProductoRepository;
        this.productoRepository = productoRepository;
        this.clienteService = clienteService;
    }

    @Transactional
    public ConsultaDTO crear(ConsultaRequest request) {
        Consulta consulta = new Consulta();
        consulta.setClienteNombre(request.clienteNombre());
        consulta.setClienteTelefono(request.clienteTelefono());

        var cliente = clienteService.obtenerOrCreate(request.clienteTelefono(), request.clienteNombre());
        if (cliente != null) {
            consulta.setCliente(cliente);
        }

        consulta.setEstado(EstadoConsulta.PENDIENTE);
        consulta = consultaRepository.save(consulta);

        List<ConsultaDTO.ProductoConsultaDTO> productos = new ArrayList<>();
        int total = 0;
        if (request.productos() != null) {
            for (ConsultaRequest.ProductoItem item : request.productos()) {
                Producto producto = productoRepository.findById(item.productoId()).orElse(null);
                if (producto != null) {
                    int cantidad = Math.max(1, item.cantidad());
                    ConsultaProducto cp = new ConsultaProducto();
                    cp.setConsulta(consulta);
                    cp.setProducto(producto);
                    cp.setCantidadSolicitada(cantidad);
                    cp.setCantidadVendida(0);
                    cp.setConfirmada(false);
                    cp.setDenegada(false);
                    consultaProductoRepository.save(cp);
                    productos.add(new ConsultaDTO.ProductoConsultaDTO(
                            cp.getId(), producto.getId(), producto.getNombre(),
                            cantidad, 0, producto.getStock(), false, false));
                    total += cantidad;
                }
            }
        }

        return new ConsultaDTO(
                consulta.getId(),
                consulta.getClienteNombre(),
                consulta.getClienteTelefono(),
                consulta.getEstado().name(),
                productos,
                total, 0, 0,
                consulta.getFechaCreacion(),
                consulta.getFechaActualizacion()
        );
    }

    @Transactional(readOnly = true)
    public List<ConsultaDTO> listarTodas() {
        return consultaRepository.findAllByOrderByFechaActualizacionDesc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConsultaDTO> listarPorCliente(Long clienteId) {
        return consultaRepository.findByClienteIdOrderByFechaActualizacionDesc(clienteId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConsultaDTO obtenerPorId(Long id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta no encontrada"));
        return toDTO(consulta);
    }

    @Transactional
    public void confirmarProducto(Long consultaProductoId, int cantidad) {
        ConsultaProducto cp = consultaProductoRepository.findById(consultaProductoId)
                .orElseThrow(() -> new RuntimeException("Producto de consulta no encontrado"));

        Producto producto = cp.getProducto();
        if (cantidad > producto.getStock()) {
            throw new RuntimeException(
                "Stock insuficiente para \"" + producto.getNombre() + "\": hay " + producto.getStock() + " unidades disponibles");
        }

        cp.setCantidadVendida(cantidad);
        cp.setConfirmada(true);
        cp.setDenegada(false);
        consultaProductoRepository.save(cp);

        int nuevoStock = Math.max(0, producto.getStock() - cantidad);
        producto.setStock(nuevoStock);
        productoRepository.save(producto);
    }

    @Transactional
    public void denegarProducto(Long consultaProductoId) {
        ConsultaProducto cp = consultaProductoRepository.findById(consultaProductoId)
                .orElseThrow(() -> new RuntimeException("Producto de consulta no encontrado"));

        cp.setDenegada(true);
        cp.setConfirmada(false);
        cp.setCantidadVendida(0);
        consultaProductoRepository.save(cp);
    }

    @Transactional
    public void confirmarConsulta(Long consultaId) {
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta no encontrada"));

        List<ConsultaProducto> productos = consultaProductoRepository.findByConsultaId(consultaId);
        for (ConsultaProducto cp : productos) {
            if (!cp.isConfirmada() && !cp.isDenegada()) {
                int cantidad = Math.max(1, cp.getCantidadSolicitada());
                Producto producto = cp.getProducto();

                if (cantidad > producto.getStock()) {
                    throw new RuntimeException(
                        "Stock insuficiente para \"" + producto.getNombre() + "\": hay " + producto.getStock() + " unidades disponibles");
                }

                cp.setCantidadVendida(cantidad);
                cp.setConfirmada(true);
                consultaProductoRepository.save(cp);

                int nuevoStock = Math.max(0, producto.getStock() - cantidad);
                producto.setStock(nuevoStock);
                productoRepository.save(producto);
            }
        }

        consulta.setEstado(EstadoConsulta.CONFIRMADA);
        consultaRepository.save(consulta);
    }

    @Transactional
    public void cancelarConsulta(Long consultaId) {
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta no encontrada"));
        consulta.setEstado(EstadoConsulta.CANCELADA);
        consultaRepository.save(consulta);
    }

    private ConsultaDTO toDTO(Consulta consulta) {
        List<ConsultaDTO.ProductoConsultaDTO> productos = consultaProductoRepository
                .findByConsultaId(consulta.getId())
                .stream()
                .map(cp -> {
                    Producto producto = cp.getProducto();
                    return new ConsultaDTO.ProductoConsultaDTO(
                        cp.getId(),
                        producto.getId(),
                        producto.getNombre(),
                        cp.getCantidadSolicitada(),
                        cp.getCantidadVendida(),
                        producto.getStock(),
                        cp.isConfirmada(),
                        cp.isDenegada()
                    );
                })
                .toList();

        int total = productos.stream().mapToInt(ConsultaDTO.ProductoConsultaDTO::cantidadSolicitada).sum();
        int confirmados = (int) productos.stream().filter(ConsultaDTO.ProductoConsultaDTO::confirmada).count();
        int denegados = (int) productos.stream().filter(ConsultaDTO.ProductoConsultaDTO::denegada).count();

        return new ConsultaDTO(
                consulta.getId(),
                consulta.getClienteNombre(),
                consulta.getClienteTelefono(),
                consulta.getEstado().name(),
                productos,
                total, confirmados, denegados,
                consulta.getFechaCreacion(),
                consulta.getFechaActualizacion()
        );
    }
}

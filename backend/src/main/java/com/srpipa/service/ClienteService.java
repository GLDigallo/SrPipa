package com.srpipa.service;

import com.srpipa.dto.ClienteDTO;
import com.srpipa.dto.ProductoRankingDTO;
import com.srpipa.entity.Cliente;
import com.srpipa.entity.ConsultaProducto;
import com.srpipa.entity.Producto;
import com.srpipa.repository.ClienteRepository;
import com.srpipa.repository.ConsultaProductoRepository;
import com.srpipa.repository.ConsultaRepository;
import com.srpipa.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ConsultaRepository consultaRepository;
    private final ConsultaProductoRepository consultaProductoRepository;
    private final ProductoRepository productoRepository;

    public ClienteService(ClienteRepository clienteRepository,
                          ConsultaRepository consultaRepository,
                          ConsultaProductoRepository consultaProductoRepository,
                          ProductoRepository productoRepository) {
        this.clienteRepository = clienteRepository;
        this.consultaRepository = consultaRepository;
        this.consultaProductoRepository = consultaProductoRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> buscar(String q) {
        return clienteRepository.buscar(q).stream()
                .map(c -> new ClienteDTO(c.getId(), c.getTelefono(), c.getNombre(), c.getFechaCreacion()))
                .toList();
    }

    @Transactional
    public Cliente obtenerOrCreate(String telefono, String nombre) {
        if (telefono == null || telefono.isBlank()) return null;
        return clienteRepository.findByTelefono(telefono).orElseGet(() -> {
            Cliente c = new Cliente();
            c.setTelefono(telefono);
            c.setNombre(nombre);
            return clienteRepository.save(c);
        });
    }

    @Transactional(readOnly = true)
    public List<ProductoRankingDTO> rankingProductos(Long clienteId, int limite) {
        List<Long> consultaIds = consultaRepository.findByClienteId(clienteId).stream()
                .map(c -> c.getId())
                .toList();

        if (consultaIds.isEmpty()) return List.of();

        Map<Long, int[]> acumulado = new LinkedHashMap<>();

        for (Long cid : consultaIds) {
            List<ConsultaProducto> productos = consultaProductoRepository.findByConsultaId(cid);
            for (ConsultaProducto cp : productos) {
                if (cp.isConfirmada()) {
                    Long pid = cp.getProducto().getId();
                    int[] stats = acumulado.computeIfAbsent(pid, k -> new int[]{0, 0});
                    stats[0]++;
                    stats[1] += cp.getCantidadVendida();
                }
            }
        }

        List<Long> productoIds = acumulado.keySet().stream().toList();
        Map<Long, String> nombres = new LinkedHashMap<>();
        for (Long pid : productoIds) {
            productoRepository.findById(pid).ifPresent(p -> nombres.put(pid, p.getNombre()));
        }

        return acumulado.entrySet().stream()
                .sorted(Comparator.<Map.Entry<Long, int[]>, Integer>comparing(e -> e.getValue()[0]).reversed())
                .limit(limite)
                .map(e -> new ProductoRankingDTO(
                        e.getKey(),
                        nombres.getOrDefault(e.getKey(), "Producto"),
                        e.getValue()[0],
                        e.getValue()[1]))
                .toList();
    }
}

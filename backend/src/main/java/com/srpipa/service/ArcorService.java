package com.srpipa.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.srpipa.dto.ArcorProducto;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class ArcorService {

    private static final String BASE_URL = "https://www.arcordigital.uy/wp-json/wc/store/v1/products";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public List<ArcorProducto> buscar(String termino, int limite) {
        try {
            String encoded = URLEncoder.encode(termino, StandardCharsets.UTF_8);
            int perPage = Math.min(limite, 100);
            String url = BASE_URL + "?search=" + encoded + "&per_page=" + perPage;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return parsearRespuesta(response.body());
        } catch (Exception e) {
            return List.of();
        }
    }

    public List<ArcorProducto> buscarPorCategoria(Long categoriaId, int limite) {
        try {
            String url = BASE_URL + "?category=" + categoriaId + "&per_page=" + limite;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return parsearRespuesta(response.body());
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<ArcorProducto> parsearRespuesta(String json) throws Exception {
        List<ArcorProducto> productos = new ArrayList<>();
        JsonNode root = objectMapper.readTree(json);

        if (!root.isArray()) {
            return productos;
        }

        for (JsonNode product : root) {
            Long id = product.path("id").asLong(0);
            String nombre = product.path("name").asText("");

            String imagenUrl = "";
            JsonNode images = product.path("images");
            if (images.isArray() && images.size() > 0) {
                imagenUrl = images.get(0).path("src").asText("");
            }

            List<String> categorias = new ArrayList<>();
            JsonNode cats = product.path("categories");
            if (cats.isArray()) {
                for (JsonNode cat : cats) {
                    String catName = cat.path("name").asText("");
                    if (!catName.isEmpty() && !catName.startsWith("-")) {
                        categorias.add(catName);
                    }
                }
            }

            String permalink = product.path("permalink").asText("");

            productos.add(new ArcorProducto(id, nombre, imagenUrl, categorias, permalink));
        }

        return productos;
    }
}

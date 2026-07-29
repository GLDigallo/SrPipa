package com.srpipa.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
public class ArcorProvider implements ProductProvider {

    private static final Logger log = LoggerFactory.getLogger(ArcorProvider.class);
    private static final String BASE_URL = "https://www.arcordigital.uy/wp-json/wc/store/v1/products";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Override
    public String getProviderName() {
        return "arcor";
    }

    @Override
    public List<SyncedProduct> fetchAll() {
        List<SyncedProduct> allProducts = new ArrayList<>();
        int page = 1;
        int perPage = 100;
        boolean hasMore = true;

        while (hasMore) {
            try {
                String url = BASE_URL + "?per_page=" + perPage + "&page=" + page;

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Accept", "application/json")
                        .GET()
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                List<SyncedProduct> batch = parsearRespuesta(response.body());
                allProducts.addAll(batch);

                if (batch.size() < perPage) {
                    hasMore = false;
                } else {
                    page++;
                }
            } catch (Exception e) {
                log.error("Error fetching Arcor page {}: {}", page, e.getMessage());
                hasMore = false;
            }
        }

        log.info("Arcor: fetched {} products total", allProducts.size());
        return allProducts;
    }

    private List<SyncedProduct> parsearRespuesta(String json) {
        List<SyncedProduct> productos = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(json);
            if (!root.isArray()) return productos;

            for (JsonNode product : root) {
                Long id = product.path("id").asLong(0);
                String nombre = product.path("name").asText("");

                String imagenUrl = "";
                JsonNode images = product.path("images");
                if (images.isArray() && !images.isEmpty()) {
                    imagenUrl = images.get(0).path("src").asText("");
                }

                String permalink = product.path("permalink").asText("");

                Long catId = null;
                String catName = "";
                JsonNode cats = product.path("categories");
                if (cats.isArray() && !cats.isEmpty()) {
                    catId = cats.get(0).path("id").asLong(0);
                    catName = cats.get(0).path("name").asText("");
                }

                productos.add(new SyncedProduct(id, nombre, imagenUrl, permalink, catId, catName));
            }
        } catch (Exception e) {
            log.error("Error parsing Arcor response: {}", e.getMessage());
        }

        return productos;
    }
}

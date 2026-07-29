package com.srpipa.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(
            @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/srpipa}") String defaultUrl,
            @Value("${spring.datasource.username:postgres}") String defaultUser,
            @Value("${spring.datasource.password:postgres}") String defaultPass) {

        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            String jdbcUrl = databaseUrl.replaceFirst("postgresql://", "jdbc:postgresql://");
            if (!jdbcUrl.contains("sslmode")) {
                jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "sslmode=require";
            }
            String rest = databaseUrl.replaceFirst("postgresql://", "");
            String user = rest.substring(0, rest.indexOf(":"));
            String pass = rest.substring(rest.indexOf(":") + 1, rest.indexOf("@"));
            return DataSourceBuilder.create()
                    .url(jdbcUrl).username(user).password(pass)
                    .driverClassName("org.postgresql.Driver").build();
        }

        return DataSourceBuilder.create()
                .url(defaultUrl).username(defaultUser).password(defaultPass)
                .driverClassName("org.postgresql.Driver").build();
    }
}

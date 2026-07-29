package com.srpipa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SrPipaApplication {

    public static void main(String[] args) {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isEmpty() && !databaseUrl.startsWith("$")) {
            String rest = databaseUrl.replaceFirst("^postgresql://", "");
            String pass = rest.substring(rest.indexOf(":") + 1, rest.indexOf("@"));
            String user = rest.substring(0, rest.indexOf(":"));
            String hostPortDb = rest.substring(rest.indexOf("@") + 1);
            String jdbcUrl = "jdbc:postgresql://" + hostPortDb;
            if (!jdbcUrl.contains("sslmode")) {
                jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "sslmode=require";
            }
            System.setProperty("spring.datasource.url", jdbcUrl);
            System.setProperty("spring.datasource.username", user);
            System.setProperty("spring.datasource.password", pass);
        }
        SpringApplication.run(SrPipaApplication.class, args);
    }
}

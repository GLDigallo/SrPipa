package com.srpipa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SrPipaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SrPipaApplication.class, args);
    }
}

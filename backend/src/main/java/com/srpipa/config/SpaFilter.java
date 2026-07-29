package com.srpipa.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Integer.MIN_VALUE)
public class SpaFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        String path = request.getRequestURI();

        if (!path.startsWith("/api") && !path.startsWith("/uploads") && !path.contains(".")
                && !"/".equals(path) && !"/index.html".equals(path)) {
            request.getRequestDispatcher("/index.html").forward(req, res);
            return;
        }

        chain.doFilter(req, res);
    }
}

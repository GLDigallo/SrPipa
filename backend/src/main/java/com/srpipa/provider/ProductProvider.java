package com.srpipa.provider;

import java.time.LocalDate;
import java.util.List;

public interface ProductProvider {

    String getProviderName();

    List<SyncedProduct> fetchAll();

    default List<SyncedProduct> fetchSince(LocalDate since) {
        return fetchAll();
    }
}

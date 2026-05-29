package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.model.Product;

public interface ProductService {
    Product addProduct(Product product);
    Product updateProduct(Product product);
    Product cancelProduct(Integer productId);
    List<Product> showAllProducts();
    Product getProductById(Integer productId);
    List<Product> searchProductByName(String name);
    List<Product> getAvailableProducts();
    List<Product> getProductsByCategory(Integer categoryId);
}

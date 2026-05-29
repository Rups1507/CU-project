package com.cu.sweetmart.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.Category;
import com.cu.sweetmart.model.Product;
import com.cu.sweetmart.repository.CategoryRepo;
import com.cu.sweetmart.repository.ProductRepo;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;
    
    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    public Product addProduct(Product product) {
    	
        if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
            Integer catId = product.getCategory().getCategoryId();
            
            Category managedCategory = categoryRepo.findById(catId)
                .orElseThrow(() -> new NoRecordsFoundException("Category not found with ID: " + catId));
            
            product.setCategory(managedCategory);
        }
        return productRepo.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        productRepo.findById(product.getProductId())
                .orElseThrow(() -> new NoRecordsFoundException("Product not found with id: " + product.getProductId()));
        
        if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
            Integer catId = product.getCategory().getCategoryId();
            Category category = categoryRepo.findById(catId)
                .orElseThrow(() -> new NoRecordsFoundException("Category not found with ID: " + catId));
            product.setCategory(category);
        }
        
        return productRepo.save(product);
    }

    @Override
    public Product cancelProduct(Integer productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NoRecordsFoundException("Product not found with id: " + productId));
        productRepo.deleteById(productId);
        return product;
    }

    @Override
    public List<Product> showAllProducts() {
        List<Product> products = productRepo.findAll();
        if (products.isEmpty()) {
            throw new NoRecordsFoundException("No products found");
        }
        return products;
    }

    @Override
    public Product getProductById(Integer productId) {
        return productRepo.findById(productId)
                .orElseThrow(() -> new NoRecordsFoundException("Product not found with id: " + productId));
    }

    @Override
    public List<Product> searchProductByName(String name) {
        List<Product> products = productRepo.findByNameContainingIgnoreCase(name);
        if (products.isEmpty()) {
            throw new NoRecordsFoundException("No products match your search: " + name);
        }
        return products;
    }

    @Override
    public List<Product> getAvailableProducts() {
        List<Product> products = productRepo.findByAvailableTrue();
        if (products.isEmpty()) {
            throw new NoRecordsFoundException("No available products found");
        }
        return products;
    }

    @Override
    public List<Product> getProductsByCategory(Integer categoryId) {
        List<Product> products = productRepo.findByCategoryId(categoryId);
        if (products.isEmpty()) {
            throw new NoRecordsFoundException("No products found for category id: " + categoryId);
        }
        return products;
    }
}

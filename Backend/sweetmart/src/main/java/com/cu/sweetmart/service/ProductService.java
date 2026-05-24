package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.Product;

public interface ProductService {
	public Product addProduct(Product product)throws NoRecordsFoundException;
	public Product updateProduct(Product product)throws NoRecordsFoundException;
	public Product cancelProduct(Integer productId)throws NoRecordsFoundException;
	public List<Product> showAllProduct()throws NoRecordsFoundException;
	public Product showAllProduct(Integer productId) throws NoRecordsFoundException ;
}

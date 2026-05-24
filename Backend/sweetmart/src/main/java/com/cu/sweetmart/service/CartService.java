package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.Cart;

public interface CartService {
	public Cart addCart(Cart cart);
	public Cart updateCart(Cart cart) throws NoRecordsFoundException; 
	public Cart cancelCart(Integer cartId) throws NoRecordsFoundException;
	public List<Cart> showAllCart() throws NoRecordsFoundException;
	public List<Cart> showAllCart(Integer cartId) throws NoRecordsFoundException;
}

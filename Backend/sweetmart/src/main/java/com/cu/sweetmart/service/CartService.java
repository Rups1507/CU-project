package com.cu.sweetmart.service;

import com.cu.sweetmart.model.Cart;

public interface CartService {
    Cart addCart(Cart cart);
    Cart updateCart(Cart cart);
    Cart getCartById(Integer cartId);
    Cart cancelCart(Integer cartId);
    Cart addProductToCart(Integer cartId, Integer productId);
    Cart removeProductFromCart(Integer cartId, Integer productId);
}

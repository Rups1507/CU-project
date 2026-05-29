package com.cu.sweetmart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.Cart;
import com.cu.sweetmart.model.Product;
import com.cu.sweetmart.repository.CartRepo;
import com.cu.sweetmart.repository.ProductRepo;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    @Override
    public Cart addCart(Cart cart) {
        return cartRepo.save(cart);
    }

    @Override
    public Cart updateCart(Cart cart) {
        cartRepo.findById(cart.getCartId())
                .orElseThrow(() -> new NoRecordsFoundException("Cart not found with id: " + cart.getCartId()));
        recalculateTotal(cart);
        return cartRepo.save(cart);
    }

    @Override
    public Cart getCartById(Integer cartId) {
        return cartRepo.findById(cartId)
                .orElseThrow(() -> new NoRecordsFoundException("Cart not found with id: " + cartId));
    }

    @Override
    public Cart cancelCart(Integer cartId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new NoRecordsFoundException("Cart not found with id: " + cartId));
        cartRepo.deleteById(cartId);
        return cart;
    }

    @Override
    public Cart addProductToCart(Integer cartId, Integer productId) {
        Cart cart = getCartById(cartId);
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NoRecordsFoundException("Product not found with id: " + productId));

        if (!Boolean.TRUE.equals(product.getAvailable())) {
            throw new NoRecordsFoundException("Product '" + product.getName() + "' is currently unavailable");
        }

        cart.getProducts().add(product);
        recalculateTotal(cart);
        return cartRepo.save(cart);
    }

    @Override
    public Cart removeProductFromCart(Integer cartId, Integer productId) {
        Cart cart = getCartById(cartId);
        cart.getProducts().removeIf(p -> p.getProductId().equals(productId));
        recalculateTotal(cart);
        return cartRepo.save(cart);
    }

    private void recalculateTotal(Cart cart) {
        double total = cart.getProducts().stream()
                .mapToDouble(p -> p.getPrice() != null ? p.getPrice() : 0.0)
                .sum();
        cart.setGrandTotal(total);
    }
}

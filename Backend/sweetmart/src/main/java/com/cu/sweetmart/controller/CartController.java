package com.cu.sweetmart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cu.sweetmart.model.Cart;
import com.cu.sweetmart.service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addCart(@RequestBody Cart cart) {
        return new ResponseEntity<>(cartService.addCart(cart), HttpStatus.CREATED);
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<Cart> getCart(@PathVariable Integer cartId) {
        return new ResponseEntity<>(cartService.getCartById(cartId), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<Cart> updateCart(@RequestBody Cart cart) {
        return new ResponseEntity<>(cartService.updateCart(cart), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{cartId}")
    public ResponseEntity<Cart> deleteCart(@PathVariable("cartId") Integer cartId) {
        return new ResponseEntity<>(cartService.cancelCart(cartId), HttpStatus.OK);
    }

    @PostMapping("/{cartId}/product/{productId}")
    public ResponseEntity<Cart> addProductToCart(@PathVariable("cartId") Integer cartId,
                                                  @PathVariable("productId") Integer productId) {
        return new ResponseEntity<>(cartService.addProductToCart(cartId, productId), HttpStatus.OK);
    }

    @DeleteMapping("/{cartId}/product/{productId}")
    public ResponseEntity<Cart> removeProductFromCart(@PathVariable("cartId") Integer cartId,
                                                       @PathVariable("productId") Integer productId) {
        return new ResponseEntity<>(cartService.removeProductFromCart(cartId, productId), HttpStatus.OK);
    }
}

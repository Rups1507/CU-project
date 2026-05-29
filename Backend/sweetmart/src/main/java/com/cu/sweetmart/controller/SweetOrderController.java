package com.cu.sweetmart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cu.sweetmart.model.SweetOrder;
import com.cu.sweetmart.service.SweetOrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/sweet_order")
public class SweetOrderController {

    @Autowired
    private SweetOrderService sweetOrderService;

    @PostMapping("/add")
    public ResponseEntity<SweetOrder> addSweetOrder(@Valid @RequestBody SweetOrder sweetOrder) {
        return new ResponseEntity<>(sweetOrderService.addSweetOrder(sweetOrder), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<SweetOrder> updateSweetOrder(@Valid @RequestBody SweetOrder sweetOrder) {
        return new ResponseEntity<>(sweetOrderService.updateSweetOrder(sweetOrder), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<SweetOrder> cancelOrder(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(sweetOrderService.cancelSweetOrder(id), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SweetOrder>> getAllOrders() {
        return new ResponseEntity<>(sweetOrderService.showAllSweetOrder(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SweetOrder> getOrderById(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(sweetOrderService.getSweetOrderById(id), HttpStatus.OK);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<SweetOrder>> getOrdersByCustomer(@PathVariable("customerId") Integer customerId) {
        return new ResponseEntity<>(sweetOrderService.getOrdersByCustomer(customerId), HttpStatus.OK);
    }

    @GetMapping("/{id}/total")
    public ResponseEntity<Double> getOrderTotal(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(sweetOrderService.calculateTotalCost(id), HttpStatus.OK);
    }
}

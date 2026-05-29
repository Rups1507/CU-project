package com.cu.sweetmart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cu.sweetmart.model.OrderBill;
import com.cu.sweetmart.service.OrderBillService;

@RestController
@RequestMapping("/orderbill")
public class OrderBillController {

    @Autowired
    private OrderBillService orderBillService;

    @PostMapping("/add")
    public ResponseEntity<OrderBill> addOrderBill(@RequestBody OrderBill orderBill) {
        return new ResponseEntity<>(orderBillService.addOrderBill(orderBill), HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<OrderBill> updateOrderBill(@RequestBody OrderBill orderBill) {
        return new ResponseEntity<>(orderBillService.updateOrderBill(orderBill), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<OrderBill> deleteOrderBill(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(orderBillService.cancelOrderBill(id), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderBill>> getAllOrderBills() {
        return new ResponseEntity<>(orderBillService.showAllOrderBill(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderBill> getOrderBillById(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(orderBillService.getOrderBillById(id), HttpStatus.OK);
    }
}

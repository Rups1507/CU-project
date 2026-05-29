package com.cu.sweetmart.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.OrderBill;
import com.cu.sweetmart.repository.OrderBillRepo;

@Service
public class OrderBillServiceImpl implements OrderBillService {

    @Autowired
    private OrderBillRepo orderBillRepo;

    @Override
    public OrderBill addOrderBill(OrderBill orderBill) {
        return orderBillRepo.save(orderBill);
    }

    @Override
    public OrderBill updateOrderBill(OrderBill orderBill) {
        orderBillRepo.findById(orderBill.getOrderBillId())
                .orElseThrow(() -> new NoRecordsFoundException("OrderBill not found with id: " + orderBill.getOrderBillId()));
        return orderBillRepo.save(orderBill);
    }

    @Override
    public OrderBill cancelOrderBill(Integer orderBillId) {
        OrderBill bill = orderBillRepo.findById(orderBillId)
                .orElseThrow(() -> new NoRecordsFoundException("OrderBill not found with id: " + orderBillId));
        orderBillRepo.deleteById(orderBillId);
        return bill;
    }

    @Override
    public List<OrderBill> showAllOrderBill() {
        List<OrderBill> bills = orderBillRepo.findAll();
        if (bills.isEmpty()) {
            throw new NoRecordsFoundException("No order bills found");
        }
        return bills;
    }

    @Override
    public OrderBill getOrderBillById(Integer orderBillId) {
        return orderBillRepo.findById(orderBillId)
                .orElseThrow(() -> new NoRecordsFoundException("OrderBill not found with id: " + orderBillId));
    }
}

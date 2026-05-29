package com.cu.sweetmart.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.SweetOrder;
import com.cu.sweetmart.repository.SweetOrderRepo;

@Service
public class SweetOrderServiceImpl implements SweetOrderService {

    @Autowired
    private SweetOrderRepo sweetOrderRepo;

    @Override
    public SweetOrder addSweetOrder(SweetOrder sweetOrder) {
        return sweetOrderRepo.save(sweetOrder);
    }

    @Override
    public SweetOrder updateSweetOrder(SweetOrder sweetOrder) {
        sweetOrderRepo.findById(sweetOrder.getSweetOrderId())
                .orElseThrow(() -> new NoRecordsFoundException("Order not found with id: " + sweetOrder.getSweetOrderId()));
        return sweetOrderRepo.save(sweetOrder);
    }

    @Override
    public SweetOrder cancelSweetOrder(Integer sweetOrderId) {
        SweetOrder order = sweetOrderRepo.findById(sweetOrderId)
                .orElseThrow(() -> new NoRecordsFoundException("Order not found with id: " + sweetOrderId));
        sweetOrderRepo.delete(order);
        return order;
    }

    @Override
    public List<SweetOrder> showAllSweetOrder() {
        List<SweetOrder> orders = sweetOrderRepo.findAll();
        if (orders.isEmpty()) {
            throw new NoRecordsFoundException("No orders found");
        }
        return orders;
    }

    @Override
    public SweetOrder getSweetOrderById(Integer sweetOrderId) {
        return sweetOrderRepo.findById(sweetOrderId)
                .orElseThrow(() -> new NoRecordsFoundException("Order not found with id: " + sweetOrderId));
    }

    @Override
    public List<SweetOrder> getOrdersByCustomer(Integer customerId) {
        List<SweetOrder> orders = sweetOrderRepo.findByCustomerUserId(customerId);
        if (orders.isEmpty()) {
            throw new NoRecordsFoundException("No orders found for customer id: " + customerId);
        }
        return orders;
    }

    @Override
    public Double calculateTotalCost(Integer sweetOrderId) {
        SweetOrder order = getSweetOrderById(sweetOrderId);
        double total = order.getOrderItems().stream()
                .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
                .sum();
        order.setTotalCost(total);
        sweetOrderRepo.save(order);
        return total;
    }
}

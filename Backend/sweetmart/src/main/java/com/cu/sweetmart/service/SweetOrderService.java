package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.model.SweetOrder;

public interface SweetOrderService {
    SweetOrder addSweetOrder(SweetOrder sweetOrder);
    SweetOrder updateSweetOrder(SweetOrder sweetOrder);
    SweetOrder cancelSweetOrder(Integer sweetOrderId);
    List<SweetOrder> showAllSweetOrder();
    SweetOrder getSweetOrderById(Integer sweetOrderId);
    List<SweetOrder> getOrdersByCustomer(Integer customerId);
    Double calculateTotalCost(Integer sweetOrderId);
}

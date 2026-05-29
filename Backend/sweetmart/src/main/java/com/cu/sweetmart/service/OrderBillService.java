package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.model.OrderBill;

public interface OrderBillService {
    OrderBill addOrderBill(OrderBill orderBill);
    OrderBill updateOrderBill(OrderBill orderBill);
    OrderBill cancelOrderBill(Integer orderBillId);
    List<OrderBill> showAllOrderBill();
    OrderBill getOrderBillById(Integer orderBillId);
}

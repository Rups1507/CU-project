package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.model.Customer;

public interface CustomerService {
    Customer addCustomer(Customer customer);
    Customer updateCustomer(Customer customer);
    Customer cancelCustomer(Integer customerId);
    List<Customer> showAllCustomer();
    Customer getCustomerById(Integer customerId);
}

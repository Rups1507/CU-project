package com.cu.sweetmart.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cu.sweetmart.exception.CustomerException;
import com.cu.sweetmart.model.Customer;
import com.cu.sweetmart.repository.CustomerRepo;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Customer addCustomer(Customer customer) {
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        return customerRepo.save(customer);
    }

    @Override
    public Customer updateCustomer(Customer customer) {
        Customer existing = customerRepo.findById(customer.getUserId())
                .orElseThrow(() -> new CustomerException("Customer not found with id: " + customer.getUserId()));

        existing.setUsername(customer.getUsername());
        existing.setAddress(customer.getAddress());
        if (customer.getPassword() != null && !customer.getPassword().startsWith("$2a$")) {
            existing.setPassword(passwordEncoder.encode(customer.getPassword()));
        }
        return customerRepo.save(existing);
    }

    @Override
    public Customer cancelCustomer(Integer customerId) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new CustomerException("Customer not found with id: " + customerId));
        customerRepo.deleteById(customerId);
        return customer;
    }

    @Override
    public List<Customer> showAllCustomer() {
        List<Customer> customers = customerRepo.findAll();
        if (customers.isEmpty()) {
            throw new CustomerException("No customers found");
        }
        return customers;
    }

    @Override
    public Customer getCustomerById(Integer customerId) {
        return customerRepo.findById(customerId)
                .orElseThrow(() -> new CustomerException("Customer not found with id: " + customerId));
    }
}

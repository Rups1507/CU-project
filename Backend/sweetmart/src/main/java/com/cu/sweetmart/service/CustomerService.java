package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.exception.CustomerException;
import com.cu.sweetmart.model.Customer;

public interface CustomerService {
	public Customer addCustomer(Customer customer)throws CustomerException;
	public Customer updateCustomer(Customer customer)throws CustomerException;
	public Customer cancelCustomer(Integer customerId)throws CustomerException;
	public List<Customer> showAllCustomer()throws CustomerException;
	
	//check with IA 
	public Customer showAllCustomer(Integer customerId)throws CustomerException;
}

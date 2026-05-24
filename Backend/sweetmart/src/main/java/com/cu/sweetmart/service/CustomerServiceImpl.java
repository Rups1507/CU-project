package com.cu.sweetmart.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cu.sweetmart.exception.CustomerException;
import com.cu.sweetmart.model.Customer;
import com.cu.sweetmart.model.User;
import com.cu.sweetmart.repository.CustomerRepo;
import com.cu.sweetmart.repository.UserRepo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CustomerServiceImpl implements CustomerService {
	
	@Autowired
	private CustomerRepo customerRepo;
	
	@Autowired
	private UserRepo userRepo;

	@Override
	public Customer addCustomer(Customer customer) throws CustomerException {
		customerRepo.save(customer);
		return customer;
	}

	@Override
	public Customer updateCustomer(Customer customer) throws CustomerException {
		Optional<User> u = userRepo.findById(customer.getUserId());
		Integer id = u.get().getUserId();
		Optional<Customer> op = customerRepo.findById(id);
		if(op.isPresent()) {
			customerRepo.save(customer);
			return customer;
		}
		else {
			throw new CustomerException("No Customer available with customerId: "+customer.getUserId());
		}
	}

	@Override
	public Customer cancelCustomer(Integer customerId) throws CustomerException {
		Optional<Customer> op = customerRepo.findById(customerId);
		if(op.isPresent()) {
			customerRepo.deleteById(customerId);
			return op.get();
		}
		else {
			throw new CustomerException("No Customer available with customerId: "+ customerId);
		}
	}

	@Override
	public List<Customer> showAllCustomer() throws CustomerException {
		 List<Customer> customers = customerRepo.findAll();
		    
		    if (customers.isEmpty()) {
		        throw new CustomerException("No customers found!");
		    }
		    
		    return customers;
	}

	@Override
	public Customer showAllCustomer(Integer customerId)throws CustomerException{
		Optional<Customer> opt = customerRepo.findById(customerId);
		if(opt.isPresent()) {
			return opt.get();
		} else {
			throw new CustomerException("Customer not found!");
		}
	}
	

}
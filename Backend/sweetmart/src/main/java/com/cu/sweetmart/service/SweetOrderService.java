package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.SweetOrder;

public interface SweetOrderService {
	public SweetOrder addSweetOrder(SweetOrder sweetOrder);
	public SweetOrder updateSweetOrder(SweetOrder sweetOrder) throws NoRecordsFoundException;
	public SweetOrder cancelSweetOrder(Integer sweetOrderId) throws NoRecordsFoundException;
	public List<SweetOrder> showAllSweetOrder() throws NoRecordsFoundException;
	public Double calculateTotalCost(Integer sweetOrderId) throws NoRecordsFoundException;
}

package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.SweetItem;

public interface SweetItemService {
	public SweetItem addSweetItem(SweetItem sweetItem);
	public SweetItem updateSweetItem(SweetItem sweetItem) throws NoRecordsFoundException;
	public SweetItem cancelSweetItem(Integer sweetItemId) throws NoRecordsFoundException;
	public List<SweetItem> showAllSweetItem() throws NoRecordsFoundException;
}

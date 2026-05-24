package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.User;

public interface UserService {
	public User addUser(User user)throws NoRecordsFoundException;
	public User updateUser(User user)throws NoRecordsFoundException;
	public User cancelUser(Integer userId)throws NoRecordsFoundException;
	public List<User> showAllUser()throws NoRecordsFoundException;
	
}

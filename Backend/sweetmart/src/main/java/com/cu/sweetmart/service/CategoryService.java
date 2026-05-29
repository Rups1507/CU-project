package com.cu.sweetmart.service;

import java.util.List;

import com.cu.sweetmart.model.Category;

public interface CategoryService {
    Category addCategory(Category category);
    Category updateCategory(Category category);
    Category cancelCategory(Integer categoryId);
    List<Category> showAllCategory();
}

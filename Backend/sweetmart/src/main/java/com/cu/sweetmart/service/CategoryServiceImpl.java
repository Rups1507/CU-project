package com.cu.sweetmart.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cu.sweetmart.exception.NoRecordsFoundException;
import com.cu.sweetmart.model.Category;
import com.cu.sweetmart.repository.CategoryRepo;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    public Category addCategory(Category category) {
        return categoryRepo.save(category);
    }

    @Override
    public Category updateCategory(Category category) {
        categoryRepo.findById(category.getCategoryId())
                .orElseThrow(() -> new NoRecordsFoundException("Category not found with id: " + category.getCategoryId()));
        return categoryRepo.save(category);
    }

    @Override
    public Category cancelCategory(Integer categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new NoRecordsFoundException("Category not found with id: " + categoryId));
        categoryRepo.deleteById(categoryId);
        return category;
    }

    @Override
    public List<Category> showAllCategory() {
        List<Category> categories = categoryRepo.findAll();
        if (categories.isEmpty()) {
            throw new NoRecordsFoundException("No categories found");
        }
        return categories;
    }
}

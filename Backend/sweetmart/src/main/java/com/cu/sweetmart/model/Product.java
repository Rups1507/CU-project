package com.cu.sweetmart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 40, message = "Product name must be between 3 and 40 characters")
    private String name;

    @NotBlank(message = "Photo path is required")
    private String photoPath;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be non-negative")
    private Double price;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Please confirm availability")
    private Boolean available;

    @Min(value = 0, message = "Quantity must be non-negative")
    private int quantity;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Category category;
}

package com.cu.sweetmart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderItemId;

    private String productName;
    private Double unitPrice;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "sweet_order_id")
    private SweetOrder sweetOrder;
}
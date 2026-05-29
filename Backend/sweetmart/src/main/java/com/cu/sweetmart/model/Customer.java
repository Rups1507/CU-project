package com.cu.sweetmart.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(callSuper = false)
@DiscriminatorValue("Customer")
public class Customer extends User {

    @NotBlank(message = "Address is required")
    private String address;

    @JsonIgnore
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<SweetOrder> sweetOrders = new HashSet<>();

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    private Cart cart;

    @JsonIgnore
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<OrderBill> bills = new HashSet<>();

    @Override
    public String toString() {
        return "Customer{userId=" + getUserId() + ", username=" + getUsername() + ", address=" + address + '}';
    }
}

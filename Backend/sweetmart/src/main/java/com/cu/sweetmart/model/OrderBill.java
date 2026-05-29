package com.cu.sweetmart.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderBill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderBillId;

    private LocalDate billDate;

    private Double totalCost;

    @JsonIgnore
    @OneToOne(mappedBy = "orderBill", cascade = CascadeType.ALL)
    private SweetOrder sweetOrder;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.PERSIST)
    private Customer customer;

    @PrePersist
    protected void onCreate() {
        if (this.billDate == null) {
            this.billDate = LocalDate.now();
        }
    }

    @Override
    public String toString() {
        return "OrderBill{orderBillId=" + orderBillId + ", billDate=" + billDate + ", totalCost=" + totalCost + '}';
    }
}

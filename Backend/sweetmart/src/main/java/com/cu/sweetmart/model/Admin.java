package com.cu.sweetmart.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@DiscriminatorValue("Admin")
public class Admin extends User {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private boolean active = true;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String role = "ROLE_ADMIN";
}

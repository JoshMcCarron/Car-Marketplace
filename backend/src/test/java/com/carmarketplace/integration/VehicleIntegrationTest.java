package com.carmarketplace.integration;

import com.carmarketplace.TestDataFactory;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.repository.VehicleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class VehicleIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired VehicleRepository vehicleRepository;

    @Test
    @DisplayName("GET /vehicles: returns empty array when no vehicles exist")
    void getVehicles_returnsEmptyArray_whenNoneExist() throws Exception {
        mockMvc.perform(get("/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    @DisplayName("GET /vehicles/{id}: returns 404 for a non-existent vehicle")
    void getVehicleById_returns404_whenNotFound() throws Exception {
        mockMvc.perform(get("/vehicles/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /vehicles?brand=Toyota: returns only Toyota vehicles (Specification filtering hits the DB)")
    void getVehicles_filtersByBrand_usingSpecification() throws Exception {
        vehicleRepository.save(TestDataFactory.buildVehicle("Toyota", 5));
        vehicleRepository.save(TestDataFactory.buildVehicle("Toyota", 3));
        Vehicle honda = TestDataFactory.buildVehicle("Honda", 2);
        vehicleRepository.save(honda);

        mockMvc.perform(get("/vehicles").param("brand", "Toyota"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].brand").value("Toyota"))
                .andExpect(jsonPath("$[1].brand").value("Toyota"));
    }

    @Test
    @DisplayName("POST /vehicles: returns 4xx without authentication (endpoint is admin-only)")
    void createVehicle_returns4xx_withoutAuth() throws Exception {
        mockMvc.perform(post("/vehicles")
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "brand":"Toyota","shape":"SUV","vehicleHistory":"new",
                                  "modelYear":2024,"stock":5,"loanDuration":60,
                                  "emissionScore":95.0,"interestRate":3.99,"price":25000.00,
                                  "co2Emission":0.0,"fuelUsage":7.5,"onSale":false,"mileage":0.0
                                }
                                """))
                .andExpect(status().is4xxClientError());
    }
}

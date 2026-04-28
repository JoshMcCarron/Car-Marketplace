package com.carmarketplace.integration;

import com.carmarketplace.TestDataFactory;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.repository.VehicleRepository;
import com.carmarketplace.service.PaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class CartIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired VehicleRepository vehicleRepository;

    // Stub payment so no real gateway is needed in any test that calls checkout.
    @MockBean PaymentService paymentService;

    // --- helpers ---

    private record Auth(String token, long userId) {}

    private Auth register(String email) throws Exception {
        String body = """
                {
                  "name": "Test User",
                  "email": "%s",
                  "password": "password123",
                  "address": "123 Main St",
                  "postalCode": "K1A0A6",
                  "city": "Ottawa",
                  "province": "ON",
                  "phoneNum": "613-555-0100"
                }
                """.formatted(email);

        MvcResult result = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return new Auth(json.get("token").asText(), json.get("userId").asLong());
    }

    // --- tests ---

    @Test
    @DisplayName("GET /users/{userId}/cart: returns 4xx without a JWT (endpoint is owner/admin only)")
    void getCart_returns4xx_withoutToken() throws Exception {
        mockMvc.perform(get("/users/1/cart"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("POST /users/{userId}/cart/{vehicleId}: adds vehicle and GET /cart returns it")
    void addToCart_vehicleAppearsInCart() throws Exception {
        Auth auth = register("bob@example.com");
        Vehicle vehicle = vehicleRepository.save(TestDataFactory.buildVehicle("Toyota", 5));
        Long vehicleId = vehicle.getVehicleID();

        mockMvc.perform(post("/users/{userId}/cart/{vehicleId}", auth.userId(), vehicleId)
                        .header("Authorization", "Bearer " + auth.token()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/users/{userId}/cart", auth.userId())
                        .header("Authorization", "Bearer " + auth.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vehicles[0].vehicleID").value(vehicleId))
                .andExpect(jsonPath("$.noItems").value(1));
    }

    @Test
    @DisplayName("POST /users/{userId}/cart/checkout: decrements vehicle stock on success")
    void checkout_decrementsVehicleStock() throws Exception {
        when(paymentService.processPayment(any())).thenReturn(true);

        Auth auth = register("carol@example.com");
        Vehicle vehicle = vehicleRepository.save(TestDataFactory.buildVehicle("Honda", 3));
        Long vehicleId = vehicle.getVehicleID();

        mockMvc.perform(post("/users/{userId}/cart/{vehicleId}", auth.userId(), vehicleId)
                        .header("Authorization", "Bearer " + auth.token()))
                .andExpect(status().isOk());

        mockMvc.perform(post("/users/{userId}/cart/checkout", auth.userId())
                        .header("Authorization", "Bearer " + auth.token()))
                .andExpect(status().isOk());

        // Stock must be decremented at the DB level, not just in memory.
        int stockAfter = vehicleRepository.findById(vehicleId)
                .orElseThrow()
                .getStock();
        assertThat(stockAfter).isEqualTo(2);
    }
}

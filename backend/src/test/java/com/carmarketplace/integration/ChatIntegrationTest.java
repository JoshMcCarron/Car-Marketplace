package com.carmarketplace.integration;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ChatIntegrationTest {

    @Autowired MockMvc mockMvc;

    @ParameterizedTest(name = "\"{0}\" -> \"{1}...\"")
    @DisplayName("POST /chat: greetings use whole words, so 'vehicles' / 'which' / 'anything' are not greetings")
    @CsvSource(delimiter = '|', value = {
            "hello                          | Welcome to the Car Marketplace",
            "show me all vehicles           | Here are all vehicles",
            "Which SUVs do you have?        | Sorry, I couldn't find any vehicles with shape 'SUV'",
            "anything with model year 2021? | Sorry, I couldn't find any vehicles with year '2021'",
            "cars from 2024                 | Sorry, I couldn't find any vehicles with year '2024'",
            "thanks, goodbye                | Thank you for visiting",
    })
    void routesMessage(String message, String expectedStart) throws Exception {
        mockMvc.perform(post("/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\": \"" + message.trim() + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response", startsWith(expectedStart.trim())));
    }
}

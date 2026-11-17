package com.carmarketplace.service;

import com.carmarketplace.service.ChatService.Intent;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

/** Intent detection is pure string logic, so no Spring context or database is needed. */
class ChatServiceTest {

    private final ChatService chatService = new ChatService(null);

    @ParameterizedTest(name = "\"{0}\" -> {1} {2}")
    @DisplayName("detectIntent: routes messages to the right intent and parameters")
    @CsvSource(delimiter = '|', value = {
            "show me tesla vehicles                              | BRAND_REQUEST           | Tesla",
            "do you have any toyotas?                            | BRAND_REQUEST           | Toyota",
            "tell me about vehicle 4                             | VEHICLE_DETAILS         | 4",
            "calculate loan for vehicle 4 with down payment 5000 | LOAN_CALCULATION        | 4",
            "what's the monthly payment on car 2 with $3000 down | LOAN_CALCULATION        | 2",
            "loan for vehicle 5 with 0 down                      | LOAN_CALCULATION        | 5",
            "can i finance car 3?                                | LOAN_CALCULATION_PROMPT | 3",
            // a model year must not be mistaken for a vehicle ID
            "show me 2023 vehicles                               | UNKNOWN                 | ''",
    })
    void detectIntent(String message, String type, String firstParam) {
        Intent intent = chatService.detectIntent(message.trim());
        assertThat(intent.getType()).isEqualTo(type);
        assertThat(intent.getParams()[0]).isEqualTo(firstParam);
    }

    @ParameterizedTest(name = "\"{0}\" -> down payment {1}")
    @DisplayName("detectIntent: extracts the down payment in the common phrasings")
    @CsvSource(delimiter = '|', value = {
            "calculate loan for vehicle 4 with down payment 5000 | 5000.0",
            "finance vehicle 1, down payment $10000              | 10000.0",
            "monthly payment on car 2 with $3000 down            | 3000.0",
            "loan for vehicle 5 with 0 down                      | 0.0",
    })
    void extractsDownPayment(String message, String expected) {
        Intent intent = chatService.detectIntent(message.trim());
        assertThat(intent.getType()).isEqualTo("LOAN_CALCULATION");
        assertThat(intent.getParams()[1]).isEqualTo(expected);
    }
}

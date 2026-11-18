package com.carmarketplace.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Stream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Every protected endpoint, checked two ways: no token -> 401, and a logged-in user who is
 * neither the owner nor an admin -> 403. The other 11 endpoints (login/register, vehicle
 * browsing, reading reviews, chat) are public by design and are not listed here.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthorizationCoverageIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    private record Auth(String token, long userId) {}

    private Auth owner;
    private Auth otherUser;

    /** All 14 protected endpoints. {owner} = the owner's user id; 1 = any vehicle / order id. */
    static Stream<Arguments> protectedEndpoints() {
        return Stream.of(
                // admin only
                Arguments.of("GET",    "/users"),
                Arguments.of("POST",   "/vehicles"),
                Arguments.of("PUT",    "/vehicles/1"),
                Arguments.of("DELETE", "/vehicles/1"),
                // owner or admin
                Arguments.of("GET",    "/users/{owner}"),
                Arguments.of("PUT",    "/users/{owner}"),
                Arguments.of("DELETE", "/users/{owner}"),
                Arguments.of("GET",    "/users/{owner}/cart"),
                Arguments.of("POST",   "/users/{owner}/cart/1"),
                Arguments.of("DELETE", "/users/{owner}/cart/1"),
                Arguments.of("POST",   "/users/{owner}/cart/checkout"),
                Arguments.of("GET",    "/users/{owner}/orders"),
                Arguments.of("GET",    "/users/{owner}/orders/1"),
                Arguments.of("POST",   "/vehicles/1/reviews/{owner}")
        );
    }

    @BeforeEach
    void registerUsers() throws Exception {
        owner = register("owner@example.com");
        otherUser = register("other@example.com");
    }

    @ParameterizedTest(name = "{0} {1} without a token -> 401")
    @MethodSource("protectedEndpoints")
    @DisplayName("Protected endpoints reject anonymous requests")
    void anonymous_isRejectedWith401(String method, String path) throws Exception {
        mockMvc.perform(build(method, path))
                .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest(name = "{0} {1} as another user -> 403")
    @MethodSource("protectedEndpoints")
    @DisplayName("Protected endpoints reject users who are neither the owner nor an admin")
    void otherUser_isRejectedWith403(String method, String path) throws Exception {
        mockMvc.perform(build(method, path).header("Authorization", "Bearer " + otherUser.token()))
                .andExpect(status().isForbidden());
    }

    // Sanity check that the rules aren't simply denying everyone: owners can read their own data.
    @ParameterizedTest(name = "GET {0} as the owner -> 200")
    @ValueSource(strings = {"/users/{owner}", "/users/{owner}/cart", "/users/{owner}/orders"})
    @DisplayName("Owners can access their own resources")
    void owner_canAccessOwnResources(String path) throws Exception {
        mockMvc.perform(build("GET", path).header("Authorization", "Bearer " + owner.token()))
                .andExpect(status().isOk());
    }

    // --- helpers ---

    private MockHttpServletRequestBuilder build(String method, String path) {
        String uri = path.replace("{owner}", String.valueOf(owner.userId()));
        MockHttpServletRequestBuilder req = request(HttpMethod.valueOf(method), uri);
        if (method.equals("POST") || method.equals("PUT")) {
            // empty JSON body so a request that gets past security isn't rejected for a missing body
            req.contentType(MediaType.APPLICATION_JSON).content("{}");
        }
        return req;
    }

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
}

package com.carmarketplace.integration;

import com.carmarketplace.entity.User;
import com.carmarketplace.repository.UserRepository;
import com.carmarketplace.security.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class UserControllerSecurityTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired UserRepository userRepository;
    @Autowired JwtUtil jwtUtil;
    @Autowired PasswordEncoder passwordEncoder;

    // --- helpers ---

    private record Auth(String token, long userId) {}

    /** Registers a USER-role account via the real auth endpoint and returns its JWT + id. */
    private Auth registerUser(String email) throws Exception {
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

    /**
     * Seeds an ADMIN user directly into the DB and mints a JWT for them.
     * Self-registration as ADMIN is intentionally blocked by AuthService,
     * so this is the only way to create an admin in tests.
     */
    private Auth createAdmin(String email) {
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode("adminpass123"));
        admin.setAddress("1 Admin Rd");
        admin.setPostalCode("A1A1A1");
        admin.setCity("Ottawa");
        admin.setProvince("ON");
        admin.setPhoneNum("613-555-0200");
        admin.setRole("ADMIN");
        User saved = userRepository.save(admin);
        return new Auth(jwtUtil.generateToken(saved), saved.getUserId());
    }

    // --- tests ---

    @Test
    @DisplayName("GET /users/{id}: owner receives 200 and the password field is absent from the response body")
    void getOwnProfile_returns200_andPasswordFieldIsAbsent() throws Exception {
        Auth auth = registerUser("alice@example.com");

        mockMvc.perform(get("/users/{id}", auth.userId())
                        .header("Authorization", "Bearer " + auth.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("alice@example.com"))
                // @JsonIgnore on User.password must be enforced at the HTTP layer, not just in unit tests
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("GET /users/{id}: authenticated user receives 403 when accessing a different user's profile")
    void getOtherUserProfile_returns403_whenNotOwner() throws Exception {
        Auth alice = registerUser("alice2@example.com");
        Auth bob   = registerUser("bob@example.com");

        // Bob's valid JWT must not grant access to Alice's profile
        mockMvc.perform(get("/users/{id}", alice.userId())
                        .header("Authorization", "Bearer " + bob.token()))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /users: regular USER role receives 403 (admin-only endpoint)")
    void listAllUsers_returns403_forRegularUser() throws Exception {
        Auth auth = registerUser("carol@example.com");

        mockMvc.perform(get("/users")
                        .header("Authorization", "Bearer " + auth.token()))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /users: ADMIN role receives 200 with a JSON array")
    void listAllUsers_returns200_forAdmin() throws Exception {
        Auth admin = createAdmin("admin@example.com");

        mockMvc.perform(get("/users")
                        .header("Authorization", "Bearer " + admin.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}

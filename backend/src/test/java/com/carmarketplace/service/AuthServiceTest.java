package com.carmarketplace.service;

import com.carmarketplace.TestDataFactory;
import com.carmarketplace.dto.AuthResponse;
import com.carmarketplace.dto.LoginRequest;
import com.carmarketplace.dto.RegisterRequest;
import com.carmarketplace.entity.User;
import com.carmarketplace.exception.EmailAlreadyInUseException;
import com.carmarketplace.repository.UserRepository;
import com.carmarketplace.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Alice Smith");
        registerRequest.setEmail("alice@example.com");
        registerRequest.setPassword("Password1!");
        registerRequest.setAddress("123 Main St");
        registerRequest.setPostalCode("K1A0A6");
        registerRequest.setCity("Ottawa");
        registerRequest.setProvince("ON");
        registerRequest.setPhoneNum("613-555-0100");
    }

    @Test
    @DisplayName("register: returns AuthResponse with token when email is new")
    void register_returnsAuthResponse_whenEmailIsNew() {
        User saved = TestDataFactory.buildUser("alice@example.com", "USER");
        saved.setUserId(1L);

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Password1!")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(saved);
        when(jwtUtil.generateToken(saved)).thenReturn("jwt-token");

        AuthResponse response = authService.register(registerRequest);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo("alice@example.com");
        assertThat(response.getRole()).isEqualTo("USER");
    }

    @Test
    @DisplayName("register: throws EmailAlreadyInUseException when email already exists")
    void register_throwsEmailAlreadyInUse_whenEmailExists() {
        when(userRepository.findByEmail("alice@example.com"))
                .thenReturn(Optional.of(TestDataFactory.buildUser("alice@example.com", "USER")));

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(EmailAlreadyInUseException.class);
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("register: always persists role USER — client cannot self-promote to ADMIN")
    void register_forcesRoleToUser_regardlessOfAnyClientValue() {
        // Pins the role-escalation invariant: if someone adds a role field to RegisterRequest
        // in the future, this test catches it before it reaches production.
        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        when(jwtUtil.generateToken(any())).thenReturn("token");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        User saved = TestDataFactory.buildUser("alice@example.com", "USER");
        saved.setUserId(1L);
        when(userRepository.save(captor.capture())).thenReturn(saved);

        authService.register(registerRequest);

        assertThat(captor.getValue().getRole()).isEqualTo("USER");
    }

    @Test
    @DisplayName("login: returns AuthResponse with token when credentials are valid")
    void login_returnsAuthResponse_whenCredentialsValid() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("alice@example.com");
        loginRequest.setPassword("Password1!");

        User user = TestDataFactory.buildUser("alice@example.com", "USER");
        user.setUserId(1L);

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(user)).thenReturn("jwt-token");

        AuthResponse response = authService.login(loginRequest);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo("alice@example.com");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("login: propagates BadCredentialsException when password is wrong")
    void login_propagatesBadCredentials_whenPasswordWrong() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("alice@example.com");
        loginRequest.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadCredentialsException.class);
        // repo must never be consulted if authentication itself fails
        verify(userRepository, never()).findByEmail(any());
    }
}

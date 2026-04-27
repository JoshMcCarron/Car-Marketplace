package com.carmarketplace.service;

import com.carmarketplace.dto.AuthResponse;
import com.carmarketplace.dto.LoginRequest;
import com.carmarketplace.dto.RegisterRequest;
import com.carmarketplace.entity.User;
import com.carmarketplace.exception.EmailAlreadyInUseException;
import com.carmarketplace.repository.UserRepository;
import com.carmarketplace.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyInUseException(request.getEmail());
        }

        // no-arg constructor already creates and links an empty Cart
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPostalCode(request.getPostalCode());
        user.setCity(request.getCity());
        user.setProvince(request.getProvince());
        user.setPhoneNum(request.getPhoneNum());
        user.setRole("USER"); // never trust the client to set its own role

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved);
        return new AuthResponse(token, saved.getUserId(), saved.getName(), saved.getEmail(), saved.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }
}

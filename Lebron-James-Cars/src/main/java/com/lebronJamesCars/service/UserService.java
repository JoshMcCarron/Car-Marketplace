package com.lebronJamesCars.service;

import com.lebronJamesCars.entity.User;
import com.lebronJamesCars.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        // Add additional business logic (e.g., hashing password, validation)
        return userRepository.save(user);
    }
    
    public Optional<User> loginUser(String email, String password) {
        return userRepository.findByEmail(email)
            .filter(user -> user.getPassword().equals(password)); // NO HASHING - only for simplicity
    }


    public Optional<User> updateUser(Long id, User newUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(newUser.getName());
            user.setEmail(newUser.getEmail());
            user.setAddress(newUser.getAddress());
            user.setPostalCode(newUser.getPostalCode());
            user.setCity(newUser.getCity());
            user.setProvince(newUser.getProvince());
            user.setPhoneNum(newUser.getPhoneNum());
            user.setRole(newUser.getRole());
            return userRepository.save(user);
        });
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

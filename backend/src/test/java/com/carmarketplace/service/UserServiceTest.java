package com.carmarketplace.service;

import com.carmarketplace.TestDataFactory;
import com.carmarketplace.entity.User;
import com.carmarketplace.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;

    @InjectMocks private UserService userService;

    @Test
    @DisplayName("getUserById: returns user when found")
    void getUserById_returnsUser_whenFound() {
        User user = TestDataFactory.buildUser("bob@example.com", "USER");
        user.setUserId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("bob@example.com");
    }

    @Test
    @DisplayName("getUserById: returns empty Optional when user does not exist")
    void getUserById_returnsEmpty_whenNotFound() {
        // Service returns Optional — the controller maps empty to 404; test the service contract directly.
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById(99L);

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("updateUser: persists allowed fields when user exists")
    void updateUser_updatesAllowedFields_whenUserExists() {
        User existing = TestDataFactory.buildUser("bob@example.com", "USER");
        existing.setUserId(1L);

        User incoming = TestDataFactory.buildUser("bob-new@example.com", "USER");
        incoming.setName("Bob Updated");
        incoming.setCity("Toronto");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.save(captor.capture())).thenReturn(existing);

        userService.updateUser(1L, incoming);

        assertThat(captor.getValue().getName()).isEqualTo("Bob Updated");
        assertThat(captor.getValue().getEmail()).isEqualTo("bob-new@example.com");
        assertThat(captor.getValue().getCity()).isEqualTo("Toronto");
    }

    @Test
    @DisplayName("updateUser: does not change role — prevents privilege escalation via profile update")
    void updateUser_doesNotModifyRole_evenWhenIncomingEntityHasDifferentRole() {
        // The controller accepts a raw User body, so a crafted request could carry role=ADMIN.
        // updateUser intentionally skips setRole — this test pins that invariant.
        User existing = TestDataFactory.buildUser("bob@example.com", "USER");
        existing.setUserId(1L);

        User incoming = TestDataFactory.buildUser("bob@example.com", "ADMIN");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.save(captor.capture())).thenReturn(existing);

        userService.updateUser(1L, incoming);

        assertThat(captor.getValue().getRole()).isEqualTo("USER");
    }

    @Test
    @DisplayName("updateUser: returns empty Optional when user does not exist")
    void updateUser_returnsEmpty_whenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<User> result = userService.updateUser(99L, TestDataFactory.buildUser("x@example.com", "USER"));

        assertThat(result).isEmpty();
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("deleteUser: returns true and calls deleteById when user exists")
    void deleteUser_returnsTrue_whenUserExists() {
        when(userRepository.existsById(1L)).thenReturn(true);

        boolean result = userService.deleteUser(1L);

        assertThat(result).isTrue();
        verify(userRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteUser: returns false and never calls deleteById when user does not exist")
    void deleteUser_returnsFalse_whenUserNotFound() {
        // Service returns boolean — the controller maps false to 404; test the service contract directly.
        when(userRepository.existsById(99L)).thenReturn(false);

        boolean result = userService.deleteUser(99L);

        assertThat(result).isFalse();
        verify(userRepository, never()).deleteById(any());
    }
}

package com.carmarketplace;

import com.carmarketplace.entity.User;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.repository.UserRepository;
import com.carmarketplace.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Profile("!test") // do not seed during the test suite
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           VehicleRepository vehicleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedVehicles();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        userRepository.save(buildUser(
                "Admin User", "admin@carmarketplace.com", "admin123", "ADMIN",
                "1 Admin Rd", "K1A0A6", "Ottawa", "ON", "613-555-0001"));

        userRepository.save(buildUser(
                "John Smith", "john@example.com", "password123", "USER",
                "42 Maple Ave", "M5H2N2", "Toronto", "ON", "416-555-0101"));

        userRepository.save(buildUser(
                "Jane Doe", "jane@example.com", "password123", "USER",
                "88 Oak St", "V6B1A1", "Vancouver", "BC", "604-555-0202"));

        userRepository.save(buildUser(
                "Carlos Rivera", "carlos@example.com", "password123", "USER",
                "5 Elm Blvd", "H3A1A1", "Montreal", "QC", "514-555-0303"));
    }

    private void seedVehicles() {
        if (vehicleRepository.count() > 0) return;

        vehicleRepository.save(new Vehicle(
                "Toyota", "SUV", "new",
                2024, 8, 60,
                88.0, new BigDecimal("4.99"), new BigDecimal("42000.00"),
                145.0, 8.2, false, 0.0));

        vehicleRepository.save(new Vehicle(
                "Honda", "Sedan", "new",
                2023, 5, 48,
                92.0, new BigDecimal("3.99"), new BigDecimal("28500.00"),
                128.0, 6.8, true, 0.0));

        vehicleRepository.save(new Vehicle(
                "Ford", "Truck", "used",
                2021, 3, 36,
                74.0, new BigDecimal("5.49"), new BigDecimal("35000.00"),
                195.0, 12.4, false, 45000.0));

        vehicleRepository.save(new Vehicle(
                "BMW", "Sedan", "new",
                2024, 4, 72,
                85.0, new BigDecimal("6.99"), new BigDecimal("68000.00"),
                152.0, 7.9, false, 0.0));

        vehicleRepository.save(new Vehicle(
                "Tesla", "SUV", "new",
                2024, 6, 60,
                98.0, new BigDecimal("0.00"), new BigDecimal("79000.00"),
                0.0, 0.0, true, 0.0));

        vehicleRepository.save(new Vehicle(
                "Hyundai", "Sedan", "used",
                2020, 7, 36,
                80.0, new BigDecimal("4.49"), new BigDecimal("18000.00"),
                132.0, 7.1, true, 62000.0));

        vehicleRepository.save(new Vehicle(
                "Subaru", "Wagon", "new",
                2023, 4, 48,
                91.0, new BigDecimal("4.29"), new BigDecimal("34500.00"),
                138.0, 7.6, false, 0.0));

        vehicleRepository.save(new Vehicle(
                "Mercedes-Benz", "Sedan", "new",
                2024, 2, 72,
                82.0, new BigDecimal("7.49"), new BigDecimal("95000.00"),
                158.0, 8.5, false, 0.0));

        vehicleRepository.save(new Vehicle(
                "Nissan", "Compact", "used",
                2022, 9, 36,
                83.0, new BigDecimal("4.79"), new BigDecimal("22000.00"),
                127.0, 6.9, true, 28000.0));

        vehicleRepository.save(new Vehicle(
                "Toyota", "Sedan", "used",
                2021, 5, 48,
                86.0, new BigDecimal("4.59"), new BigDecimal("24500.00"),
                131.0, 7.3, false, 38000.0));
    }

    private User buildUser(String name, String email, String rawPassword, String role,
                           String address, String postalCode, String city,
                           String province, String phoneNum) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setAddress(address);
        user.setPostalCode(postalCode);
        user.setCity(city);
        user.setProvince(province);
        user.setPhoneNum(phoneNum);
        return user;
    }
}

package com.carmarketplace.service;

import com.carmarketplace.TestDataFactory;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.repository.VehicleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock private VehicleRepository vehicleRepository;

    @InjectMocks private VehicleService vehicleService;

    @Test
    @DisplayName("getVehicleById: returns vehicle when found")
    void getVehicleById_returnsVehicle_whenFound() {
        Vehicle vehicle = TestDataFactory.buildVehicle("Toyota", 3);
        vehicle.setVehicleID(1L);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        Optional<Vehicle> result = vehicleService.getVehicleById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getBrand()).isEqualTo("Toyota");
    }

    @Test
    @DisplayName("getVehicleById: returns empty Optional when vehicle does not exist")
    void getVehicleById_returnsEmpty_whenNotFound() {
        when(vehicleRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Vehicle> result = vehicleService.getVehicleById(99L);

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("getFilteredAndSortedVehicles: delegates to findAll(Specification, Sort) — not the in-memory overload")
    void getFilteredAndSortedVehicles_callsSpecificationOverload_whenFiltersProvided() {
        // Verifies the JPA Specification path is taken (database-level filtering),
        // not the old approach of loading all vehicles and streaming in Java.
        List<Vehicle> expected = List.of(
                TestDataFactory.buildVehicle("Toyota", 2),
                TestDataFactory.buildVehicle("Toyota", 1)
        );
        when(vehicleRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(expected);

        List<Vehicle> result = vehicleService.getFilteredAndSortedVehicles(
                "Toyota", null, null, null, null, "brand", "asc");

        assertThat(result).hasSize(2);
        assertThat(result).allMatch(v -> v.getBrand().equals("Toyota"));
        // Confirm the Specification overload was called, not findAll() with no spec
        verify(vehicleRepository).findAll(any(Specification.class), any(Sort.class));
    }
}

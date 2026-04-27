package com.lebronJamesCars.controller;

import com.lebronJamesCars.entity.Vehicle;
import com.lebronJamesCars.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // Public — GET routes covered by SecurityConfig permitAll
    @GetMapping
    public List<Vehicle> getVehicles(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String shape,
            @RequestParam(required = false) Integer modelYear,
            @RequestParam(required = false) String vehicleHistory,
            @RequestParam(required = false) Boolean onSale,
            @RequestParam(required = false, defaultValue = "price") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String direction) {
        return vehicleService.getFilteredAndSortedVehicles(
                brand, shape, modelYear, vehicleHistory, onSale, sortBy, direction);
    }

    @GetMapping("/brand/{brand}")
    public List<Vehicle> getVehiclesByBrand(@PathVariable String brand) {
        return vehicleService.getVehiclesByBrand(brand);
    }

    @GetMapping("/shape/{shape}")
    public List<Vehicle> getVehiclesByShape(@PathVariable String shape) {
        return vehicleService.getVehiclesByShape(shape);
    }

    @GetMapping("/modelYear/{modelYear}")
    public List<Vehicle> getVehiclesByModelYear(@PathVariable int modelYear) {
        return vehicleService.getVehiclesByModelYear(modelYear);
    }

    @GetMapping("/vehicleHistory/{vehicleHistory}")
    public List<Vehicle> getVehiclesByVehicleHistory(@PathVariable String vehicleHistory) {
        return vehicleService.getVehiclesByVehicleHistory(vehicleHistory);
    }

    @GetMapping("/onSale/{onSale}")
    public List<Vehicle> getVehiclesByOnSale(@PathVariable boolean onSale) {
        return vehicleService.getVehiclesByOnSale(onSale);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Admin only — write operations
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.createVehicle(vehicle));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(id, vehicle)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        if (vehicleService.deleteVehicle(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

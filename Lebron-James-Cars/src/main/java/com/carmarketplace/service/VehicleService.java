package com.lebronJamesCars.service;

import com.lebronJamesCars.entity.Vehicle;
import com.lebronJamesCars.exception.ResourceNotFoundException;
import com.lebronJamesCars.repository.VehicleRepository;
import com.lebronJamesCars.repository.specification.VehicleSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> getAllVehicles(String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return vehicleRepository.findAll(sort);
    }

    public List<Vehicle> getFilteredAndSortedVehicles(
            String brand, String shape, Integer modelYear,
            String vehicleHistory, Boolean onSale,
            String sortBy, String direction) {

        Specification<Vehicle> spec = Specification
                .where(VehicleSpecification.hasBrand(brand))
                .and(VehicleSpecification.hasShape(shape))
                .and(VehicleSpecification.hasModelYear(modelYear))
                .and(VehicleSpecification.hasVehicleHistory(vehicleHistory))
                .and(VehicleSpecification.isOnSale(onSale));

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return vehicleRepository.findAll(spec, sort);
    }

    public List<Vehicle> getVehiclesByBrand(String brand) {
        return vehicleRepository.findByBrand(brand);
    }

    public List<Vehicle> getVehiclesByShape(String shape) {
        return vehicleRepository.findByShape(shape);
    }

    public List<Vehicle> getVehiclesByModelYear(int modelYear) {
        return vehicleRepository.findByModelYear(modelYear);
    }

    public List<Vehicle> getVehiclesByVehicleHistory(String vehicleHistory) {
        return vehicleRepository.findByVehicleHistory(vehicleHistory);
    }

    public List<Vehicle> getVehiclesByOnSale(boolean onSale) {
        return vehicleRepository.findByOnSale(onSale);
    }

    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Optional<Vehicle> updateVehicle(Long id, Vehicle newVehicle) {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setBrand(newVehicle.getBrand());
            vehicle.setShape(newVehicle.getShape());
            vehicle.setVehicleHistory(newVehicle.getVehicleHistory());
            vehicle.setModelYear(newVehicle.getModelYear());
            vehicle.setStock(newVehicle.getStock());
            vehicle.setLoanDuration(newVehicle.getLoanDuration());
            vehicle.setEmissionScore(newVehicle.getEmissionScore());
            vehicle.setInterestRate(newVehicle.getInterestRate());
            vehicle.setPrice(newVehicle.getPrice());
            vehicle.setCo2Emission(newVehicle.getCo2Emission());
            vehicle.setFuelUsage(newVehicle.getFuelUsage());
            vehicle.setOnSale(newVehicle.isOnSale());
            vehicle.setMileage(newVehicle.getMileage());
            return vehicleRepository.save(vehicle);
        });
    }

    public boolean deleteVehicle(Long id) {
        if (vehicleRepository.existsById(id)) {
            vehicleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

package com.lebronJamesCars.service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.lebronJamesCars.entity.Vehicle;
import com.lebronJamesCars.repository.VehicleRepository;

@Service
public class VehicleService {
    private final VehicleRepository vehicleRepository;
    
    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    
    public List<Vehicle> getAllVehicles(){
        return vehicleRepository.findAll();
    }
    
    // Get all vehicles with sorting
    public List<Vehicle> getAllVehicles(String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return vehicleRepository.findAll(sort);
    }
    
    // Combined filtering and sorting method
    public List<Vehicle> getFilteredAndSortedVehicles(
            String brand, String shape, Integer modelYear, 
            String vehicleHistory, Boolean onSale,
            String sortBy, String direction) {
        
        // Get all vehicles first
        List<Vehicle> vehicles = vehicleRepository.findAll();
        
        // Apply filters (if provided)
        if (brand != null && !brand.isEmpty()) {
            vehicles = vehicles.stream()
                .filter(v -> v.getBrand().equalsIgnoreCase(brand))
                .collect(Collectors.toList());
        }
        
        if (shape != null && !shape.isEmpty()) {
            vehicles = vehicles.stream()
                .filter(v -> v.getShape().equalsIgnoreCase(shape))
                .collect(Collectors.toList());
        }
        
        if (modelYear != null) {
            vehicles = vehicles.stream()
                .filter(v -> v.getModelYear() == modelYear)
                .collect(Collectors.toList());
        }
        
        if (vehicleHistory != null && !vehicleHistory.isEmpty()) {
            vehicles = vehicles.stream()
                .filter(v -> v.getVehicleHistory().equalsIgnoreCase(vehicleHistory))
                .collect(Collectors.toList());
        }
        
        if (onSale != null) {
            vehicles = vehicles.stream()
                .filter(v -> v.isOnSale() == onSale)
                .collect(Collectors.toList());
        }
        
        // Apply sorting - add .collect(Collectors.toList()) to each stream operation
        if ("price".equals(sortBy)) {
            vehicles = direction.equalsIgnoreCase("desc") ?
                vehicles.stream().sorted((v1, v2) -> v2.getPrice().compareTo(v1.getPrice())).collect(Collectors.toList()) :
                vehicles.stream().sorted((v1, v2) -> v1.getPrice().compareTo(v2.getPrice())).collect(Collectors.toList());
        } else if ("modelYear".equals(sortBy)) {
            vehicles = direction.equalsIgnoreCase("desc") ?
                vehicles.stream().sorted((v1, v2) -> Integer.compare(v2.getModelYear(), v1.getModelYear())).collect(Collectors.toList()) :
                vehicles.stream().sorted((v1, v2) -> Integer.compare(v1.getModelYear(), v2.getModelYear())).collect(Collectors.toList());
        } else if ("mileage".equals(sortBy)) {
            vehicles = direction.equalsIgnoreCase("desc") ?
                    vehicles.stream().sorted((v1, v2) -> Double.compare(v2.getMileage(), v1.getMileage())).collect(Collectors.toList()) :
                    vehicles.stream().sorted((v1, v2) -> Double.compare(v1.getMileage(), v2.getMileage())).collect(Collectors.toList());
        }
       
        return vehicles;
    }
    
    // Keep existing methods...
    public List<Vehicle> getVehiclesByBrand(String brand) {
        return vehicleRepository.findByBrand(brand);
    }
    
    public List<Vehicle> getVehiclesByShape(String shape) {
        return vehicleRepository.findByShape(shape);
    }
    
    public List<Vehicle> getVehiclesByModelYear(int modelYear) {
        return vehicleRepository.findByModelYear(modelYear);
    }
    
    public List<Vehicle> getVehiclesByVehicleHistory(String vehicleHistory){
        return vehicleRepository.findByVehicleHistory(vehicleHistory);
    }
    
    public List<Vehicle> getVehiclesByOnSale(boolean onSale){
        return vehicleRepository.findByOnSale(onSale);
    }
    
    public Optional<Vehicle> getVehicleById(Long id){
        return vehicleRepository.findById(id);
    }
    
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }
    
    public Optional<Vehicle> updateVehicle(Long id, Vehicle newVehicle){
        return vehicleRepository.findById(id).map(vehicle ->{
            vehicle.setBrand(newVehicle.getBrand());
            vehicle.setShape(newVehicle.getShape());
            vehicle.setVehicleHistory(newVehicle.getVehicleHistory());
            vehicle.setReviews(newVehicle.getReviews());
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
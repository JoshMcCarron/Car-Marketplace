package com.lebronJamesCars.service;

import org.springframework.stereotype.Service;
import com.lebronJamesCars.entity.Vehicle;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {
    
    private final VehicleService vehicleService;
    
    public ChatService(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }
    
    public String handleVehicleDetailQuery(Long vehicleId) {
        Optional<Vehicle> vehicleOpt = vehicleService.getVehicleById(vehicleId);
        
        if (vehicleOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();
            StringBuilder details = new StringBuilder();
            
            details.append("Vehicle Details for ID ").append(vehicleId).append(":\n\n");
            details.append("- ").append(vehicle.getModelYear()).append(" ").append(vehicle.getBrand()).append("\n");
            details.append("- Shape: ").append(vehicle.getShape()).append("\n");
            details.append("- Price: $").append(vehicle.getPrice()).append(vehicle.isOnSale() ? " (ON SALE!)" : "").append("\n");
            details.append("- Mileage: ").append(vehicle.getMileage()).append(" miles\n");
            details.append("- Stock: ").append(vehicle.getStock()).append(" available\n");
            
            if (vehicle.getVehicleHistory() != null && !vehicle.getVehicleHistory().isEmpty()) {
                details.append("- History: ").append(vehicle.getVehicleHistory()).append("\n");
            }
            
            details.append("\nEnvironmental Information:\n");
            details.append("- Emission Score: ").append(vehicle.getEmissionScore()).append("\n");
            details.append("- CO2 Emission: ").append(vehicle.getCo2Emission()).append(" g/km\n");
            details.append("- Fuel Usage: ").append(vehicle.getFuelUsage()).append(" L/100km\n");
            
            details.append("\nFinancing Options:\n");
            details.append("- Interest Rate: ").append(vehicle.getInterestRate()).append("%\n");
            details.append("- Available Loan Duration: ").append(vehicle.getLoanDuration()).append(" months\n");
            
            details.append("\nWould you like to calculate a monthly payment for this vehicle?");
            
            return details.toString();
        } else {
            return "Sorry, I couldn't find a vehicle with ID " + vehicleId + ". Please check the ID and try again.";
        }
    }
    
    public String calculateLoanPayment(Long vehicleId, double downPayment) {
        Optional<Vehicle> vehicleOpt = vehicleService.getVehicleById(vehicleId);
        
        if (vehicleOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();
            double price = vehicle.getPrice().doubleValue();
            double interestRate = vehicle.getInterestRate().doubleValue();
            int loanDuration = vehicle.getLoanDuration();
            
            double monthlyPayment = vehicle.calculateLoan(price, downPayment, interestRate, loanDuration);
            
            StringBuilder response = new StringBuilder();
            response.append("Loan Calculation for ").append(vehicle.getModelYear()).append(" ")
                   .append(vehicle.getBrand()).append(":\n\n");
            response.append("- Vehicle Price: $").append(String.format("%,.2f", price)).append("\n");
            response.append("- Down Payment: $").append(String.format("%,.2f", downPayment)).append("\n");
            response.append("- Loan Amount: $").append(String.format("%,.2f", price - downPayment)).append("\n");
            response.append("- Interest Rate: ").append(interestRate).append("%\n");
            response.append("- Loan Duration: ").append(loanDuration).append(" months\n\n");
            response.append("Your estimated monthly payment would be: $").append(String.format("%,.2f", monthlyPayment)).append("\n\n");
            response.append("Would you like to adjust the down payment or see details for another vehicle?");
            
            return response.toString();
        } else {
            return "Sorry, I couldn't find a vehicle with ID " + vehicleId + ". Please check the ID and try again.";
        }
    }
    
    public Intent detectIntent(String message) {
        message = message.toLowerCase();
        
        if (containsVehicleDetailQuery(message)) {
            Long vehicleId = extractVehicleId(message);
            if (vehicleId != null) {
                System.out.println("Detected VEHICLE_DETAILS intent with ID: " + vehicleId);
                return new Intent("VEHICLE_DETAILS", vehicleId.toString());
            }
        }
        
        if (containsLoanCalculationRequest(message)) {
            Long vehicleId = extractVehicleId(message);
            Double downPayment = extractDownPayment(message);
            
            if (vehicleId != null && downPayment != null) {
                System.out.println("Detected LOAN_CALCULATION intent with ID: " + vehicleId + " and down payment: " + downPayment);
                return new Intent("LOAN_CALCULATION", vehicleId.toString(), downPayment.toString());
            } else if (vehicleId != null) {
                System.out.println("Detected LOAN_CALCULATION_PROMPT intent with ID: " + vehicleId);
                return new Intent("LOAN_CALCULATION_PROMPT", vehicleId.toString());
            }
        }
        
        if (containsBrandRequest(message)) {
            String brand = extractBrand(message);
            if (brand != null) {
                System.out.println("Detected BRAND_REQUEST intent for brand: " + brand.toLowerCase());
                return new Intent("BRAND_REQUEST", brand);
            }
        }
        
        System.out.println("Detected UNKNOWN intent");
        return new Intent("UNKNOWN", "");
    }
    
    private boolean containsVehicleDetailQuery(String message) {
        // Check for keywords related to vehicle details and ensure an ID is present
        return (message.contains("details") || message.contains("information") || 
                message.contains("tell me about") || message.contains("show me")) &&
               extractVehicleId(message) != null;
    }
    
    private boolean containsLoanCalculationRequest(String message) {
        return (message.contains("loan") || message.contains("payment") || message.contains("finance") 
                || message.contains("calculate")) && extractVehicleId(message) != null;
    }
    
    private Long extractVehicleId(String message) {
        // Match patterns like "vehicle 5", "id 5", "car 5"
        Pattern pattern = Pattern.compile("\\b(vehicle|id|car)\\s*(\\d+)\\b", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(message);
        
        if (matcher.find()) {
            return Long.parseLong(matcher.group(2)); // Return the captured number
        }
        
        // Fallback: Try to match just a standalone number
        pattern = Pattern.compile("\\b(\\d+)\\b");
        matcher = pattern.matcher(message);
        if (matcher.find()) {
            return Long.parseLong(matcher.group(1));
        }
        
        return null; // Return null if no ID is found
    }
    
    private Double extractDownPayment(String message) {
        Pattern pattern = Pattern.compile("\\bdown\\s*payment\\s*\\$?\\s*(\\d+(?:\\.\\d+)?)\\b|\\bdown\\s*\\$?\\s*(\\d+(?:\\.\\d+)?)\\b");
        Matcher matcher = pattern.matcher(message);
        
        if (matcher.find()) {
            for (int i = 1; i <= matcher.groupCount(); i++) {
                if (matcher.group(i) != null) {
                    return Double.parseDouble(matcher.group(i));
                }
            }
        }
        
        return null;
    }
    
    private boolean containsBrandRequest(String message) {
    	String[] brands = {
    		    "toyota", "honda", "ford", "chevrolet", "bmw", "mercedes-benz", "audi", "lexus",
    		    "tesla", "nissan", "hyundai", "kia", "jeep", "chrysler", "subaru", "volvo",
    		    "porsche", "mazda", "mitsubishi", "suzuki", "alfa romeo", "aston martin", "bentley",
    		    "ferrari", "lamborghini", "rolls royce", "mclaren", "jaguar", "land rover", "renault",
    		    "dacia", "seat", "skoda", "tata", "suzuki", "datsun"
    		};
    	for (String brand : brands) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(brand) + "\\b", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(message);
            if (matcher.find()) {
                return true;
            }
        }
        return false;
    }

    private String extractBrand(String message) {
    	String[] brands = {
    		    "toyota", "honda", "ford", "chevrolet", "bmw", "mercedes-benz", "audi", "lexus",
    		    "tesla", "nissan", "hyundai", "kia", "jeep", "chrysler", "subaru", "volvo",
    		    "porsche", "mazda", "mitsubishi", "suzuki", "alfa romeo", "aston martin", "bentley",
    		    "ferrari", "lamborghini", "rolls royce", "mclaren", "jaguar", "land rover", "renault",
    		    "dacia", "seat", "skoda", "tata", "suzuki", "datsun"
    		};
    	for (String brand : brands) {
            String brandLower = brand.toLowerCase(); // Normalize brand
            
            // Check if the brand is in the message as a whole word
            if (message.matches(".*\\b" + brandLower + "\\b.*") || 
                message.contains(" " + brandLower + " ") ||
                message.startsWith(brandLower + " ") ||
                message.endsWith(" " + brandLower)) {
                
                // Capitalize the first letter only
                return brand.substring(0, 1).toUpperCase() + brand.substring(1);
            }
        }
        return null;
    }
    
    public static class Intent {
        private String type;
        private String[] params;
        
        public Intent(String type, String... params) {
            this.type = type;
            this.params = params;
        }
        
        public String getType() {
            return type;
        }
        
        public String[] getParams() {
            return params;
        }
    }
}
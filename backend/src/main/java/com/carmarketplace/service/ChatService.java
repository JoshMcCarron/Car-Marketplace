package com.carmarketplace.service;

import com.carmarketplace.entity.Vehicle;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {

    public static final List<String> BRANDS = List.of(
            "toyota", "honda", "ford", "chevrolet", "bmw", "mercedes-benz", "audi", "lexus",
            "tesla", "nissan", "hyundai", "kia", "jeep", "chrysler", "subaru", "volvo",
            "porsche", "mazda", "mitsubishi", "suzuki", "alfa romeo", "aston martin", "bentley",
            "ferrari", "lamborghini", "rolls royce", "mclaren", "jaguar", "land rover", "renault",
            "dacia", "seat", "skoda", "tata", "datsun"
    );

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
        }

        return "Sorry, I couldn't find a vehicle with ID " + vehicleId + ". Please check the ID and try again.";
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
            response.append("Your estimated monthly payment would be: $")
                    .append(String.format("%,.2f", monthlyPayment)).append("\n\n");
            response.append("Would you like to adjust the down payment or see details for another vehicle?");
            return response.toString();
        }

        return "Sorry, I couldn't find a vehicle with ID " + vehicleId + ". Please check the ID and try again.";
    }

    public Intent detectIntent(String message) {
        message = message.toLowerCase();

        if (containsBrandRequest(message)) {
            String brand = extractBrand(message);
            if (brand != null) {
                return new Intent("BRAND_REQUEST", brand);
            }
        }

        if (containsVehicleDetailQuery(message)) {
            Long vehicleId = extractVehicleId(message);
            if (vehicleId != null) {
                return new Intent("VEHICLE_DETAILS", vehicleId.toString());
            }
        }

        if (containsLoanCalculationRequest(message)) {
            Long vehicleId = extractVehicleId(message);
            Double downPayment = extractDownPayment(message);

            if (vehicleId != null && downPayment != null) {
                return new Intent("LOAN_CALCULATION", vehicleId.toString(), downPayment.toString());
            } else if (vehicleId != null) {
                return new Intent("LOAN_CALCULATION_PROMPT", vehicleId.toString());
            }
        }

        return new Intent("UNKNOWN", "");
    }

    private boolean containsVehicleDetailQuery(String message) {
        return (message.contains("details") || message.contains("information") ||
                message.contains("tell me about") || message.contains("show me")) &&
               extractVehicleId(message) != null;
    }

    private boolean containsLoanCalculationRequest(String message) {
        return (message.contains("loan") || message.contains("payment") ||
                message.contains("finance") || message.contains("calculate")) &&
               extractVehicleId(message) != null;
    }

    private boolean containsBrandRequest(String message) {
        for (String brand : BRANDS) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(brand) + "\\b", Pattern.CASE_INSENSITIVE);
            if (pattern.matcher(message).find()) {
                return true;
            }
        }
        return false;
    }

    private String extractBrand(String message) {
        for (String brand : BRANDS) {
            if (message.matches(".*\\b" + brand + "\\b.*")) {
                return brand.substring(0, 1).toUpperCase() + brand.substring(1);
            }
        }
        return null;
    }

    private Long extractVehicleId(String message) {
        Pattern pattern = Pattern.compile("\\b(vehicle|id|car)\\s*(\\d+)\\b", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return Long.parseLong(matcher.group(2));
        }

        pattern = Pattern.compile("\\b(\\d+)\\b");
        matcher = pattern.matcher(message);
        if (matcher.find()) {
            return Long.parseLong(matcher.group(1));
        }
        return null;
    }

    private Double extractDownPayment(String message) {
        Pattern pattern = Pattern.compile(
                "\\bdown\\s*payment\\s*\\$?\\s*(\\d+(?:\\.\\d+)?)\\b|\\bdown\\s*\\$?\\s*(\\d+(?:\\.\\d+)?)\\b");
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

    public static class Intent {
        private final String type;
        private final String[] params;

        public Intent(String type, String... params) {
            this.type = type;
            this.params = params;
        }

        public String getType() { return type; }
        public String[] getParams() { return params; }
    }
}

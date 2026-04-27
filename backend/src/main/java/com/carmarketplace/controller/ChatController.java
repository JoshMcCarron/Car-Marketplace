package com.carmarketplace.controller;

import com.carmarketplace.dto.ChatRequest;
import com.carmarketplace.dto.ChatResponse;
import com.carmarketplace.entity.Vehicle;
import com.carmarketplace.service.ChatService;
import com.carmarketplace.service.ChatService.Intent;
import com.carmarketplace.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final VehicleService vehicleService;
    private final ChatService chatService;
    private final Map<String, String> responses = new HashMap<>();

    public ChatController(VehicleService vehicleService, ChatService chatService) {
        this.vehicleService = vehicleService;
        this.chatService = chatService;

        responses.put("greeting", "Welcome to the Car Marketplace! How can I help you today?");
        responses.put("help", "I can help you find vehicles by brand, shape, model year, or show you our hot deals.");
        responses.put("goodbye", "Thank you for visiting! Have a great day!");
        responses.put("fallback", "I'm not sure I understand. Try asking about our vehicle inventory, specific brands, or hot deals.");
    }

    @PostMapping
    public ResponseEntity<ChatResponse> processMessage(@RequestBody ChatRequest request) {
        String message = request.getMessage().toLowerCase().trim();
        String response;
        List<Vehicle> vehicles = null;

        Intent intent = chatService.detectIntent(message);

        if ("VEHICLE_DETAILS".equals(intent.getType())) {
            Long vehicleId = Long.parseLong(intent.getParams()[0]);
            response = chatService.handleVehicleDetailQuery(vehicleId);

        } else if ("LOAN_CALCULATION".equals(intent.getType())) {
            Long vehicleId = Long.parseLong(intent.getParams()[0]);
            double downPayment = Double.parseDouble(intent.getParams()[1]);
            response = chatService.calculateLoanPayment(vehicleId, downPayment);

        } else if ("LOAN_CALCULATION_PROMPT".equals(intent.getType())) {
            Long vehicleId = Long.parseLong(intent.getParams()[0]);
            response = "How much would you like to put as a down payment for vehicle ID " + vehicleId + "?";

        } else if ("BRAND_REQUEST".equals(intent.getType())) {
            String brand = intent.getParams()[0];
            vehicles = vehicleService.getVehiclesByBrand(brand);
            response = formatVehicleResponse(vehicles, "brand", brand);

        } else if (containsGreeting(message)) {
            response = responses.get("greeting");

        } else if (message.contains("help") || message.contains("what can you do")) {
            response = responses.get("help");

        } else if (containsGoodbye(message)) {
            response = responses.get("goodbye");

        } else if (message.contains("shape") || message.contains("type") ||
                   message.contains("suv") || message.contains("sedan") ||
                   message.contains("truck") || message.contains("coupe")) {
            String shape = extractShape(message);
            if (shape != null) {
                vehicles = vehicleService.getVehiclesByShape(shape);
                response = formatVehicleResponse(vehicles, "shape", shape);
            } else {
                response = "What type of vehicle are you looking for? We have sedans, SUVs, trucks, and more.";
            }

        } else if (message.contains("year") || message.contains("model year")) {
            Integer year = extractYear(message);
            if (year != null) {
                vehicles = vehicleService.getVehiclesByModelYear(year);
                response = formatVehicleResponse(vehicles, "year", year.toString());
            } else {
                response = "Which model year are you interested in?";
            }

        } else if (message.contains("deal") || message.contains("sale") ||
                   message.contains("hot deal") || message.contains("discount")) {
            vehicles = vehicleService.getVehiclesByOnSale(true);
            response = formatVehicleResponse(vehicles, "on sale", "true");

        } else if (message.contains("all") &&
                   (message.contains("vehicle") || message.contains("car") || message.contains("inventory"))) {
            vehicles = vehicleService.getAllVehicles("price", "asc");
            response = "Here are all vehicles in our inventory, sorted by price:\n" + formatVehicleList(vehicles, 10);

        } else {
            response = responses.get("fallback");
        }

        return ResponseEntity.ok(new ChatResponse(response));
    }

    private boolean containsGreeting(String message) {
        for (String g : new String[]{"hello", "hi", "hey", "greetings", "howdy"}) {
            if (message.contains(g)) return true;
        }
        return false;
    }

    private boolean containsGoodbye(String message) {
        for (String g : new String[]{"bye", "goodbye", "see you", "later", "exit", "quit"}) {
            if (message.contains(g)) return true;
        }
        return false;
    }

    private String extractShape(String message) {
        if (message.contains("suv")) return "SUV";
        if (message.contains("sedan")) return "Sedan";
        if (message.contains("truck")) return "Truck";
        if (message.contains("coupe")) return "Coupe";
        if (message.contains("convertible")) return "Convertible";
        if (message.contains("hatchback")) return "Hatchback";
        return null;
    }

    private Integer extractYear(String message) {
        Pattern pattern = Pattern.compile("\\b(19|20)\\d{2}\\b");
        Matcher matcher = pattern.matcher(message);
        return matcher.find() ? Integer.parseInt(matcher.group()) : null;
    }

    private String formatVehicleResponse(List<Vehicle> vehicles, String filterType, String filterValue) {
        if (vehicles == null || vehicles.isEmpty()) {
            return "Sorry, I couldn't find any vehicles with " + filterType + " '" + filterValue + "'.";
        }
        StringBuilder response = new StringBuilder();
        response.append("I found ").append(vehicles.size()).append(" vehicles with ")
                .append(filterType).append(" '").append(filterValue).append("':\n\n");
        response.append(formatVehicleList(vehicles, 10));
        if (vehicles.size() > 10) {
            response.append("\nThere are ").append(vehicles.size() - 10)
                    .append(" more vehicles. Would you like to see more?");
        }
        return response.toString();
    }

    private String formatVehicleList(List<Vehicle> vehicles, int limit) {
        StringBuilder result = new StringBuilder();
        int count = 0;
        for (Vehicle vehicle : vehicles) {
            if (count++ >= limit) break;
            result.append("- ").append(vehicle.getModelYear()).append(" ")
                  .append(vehicle.getBrand()).append(" (").append(vehicle.getShape()).append(")\n")
                  .append("  Price: $").append(vehicle.getPrice())
                  .append(vehicle.isOnSale() ? " (ON SALE!)" : "").append("\n")
                  .append("  Mileage: ").append(vehicle.getMileage()).append(" miles\n")
                  .append("  Vehicle ID: ").append(vehicle.getVehicleID()).append("\n\n");
        }
        return result.toString();
    }
}

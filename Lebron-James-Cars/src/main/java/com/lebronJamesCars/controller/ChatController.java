package com.lebronJamesCars.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.lebronJamesCars.entity.Vehicle;
import com.lebronJamesCars.service.VehicleService;
import com.lebronJamesCars.service.ChatService;
import com.lebronJamesCars.service.ChatService.Intent;

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
    
    // Keep track of conversation state
    private final Map<String, Object> sessionData = new HashMap<>();
    
    public ChatController(VehicleService vehicleService, ChatService chatbotService) {
        this.vehicleService = vehicleService;
        this.chatService = chatbotService;
        
        // Initialize with default responses
        responses.put("greeting", "Welcome to LeBron James Cars! How can I help you today?");
        responses.put("help", "I can help you find vehicles by brand, shape, model year, or show you our hot deals");
        responses.put("goodbye", "Thank you for visiting LeBron James Cars! Have a great day!");
        responses.put("hot_deals", "Let me show you our current hot deals!");
        responses.put("fallback", "I'm not sure I understand. Try asking about our vehicle inventory, specific brands, or hot deals.");
    }
    
    @PostMapping
    public ResponseEntity<ChatResponse> processMessage(@RequestBody ChatRequest request) {
        String message = request.getMessage().toLowerCase().trim();
        String response;
        List<Vehicle> vehicles = null;

        // First check for advanced intents using our service
        Intent intent = chatService.detectIntent(message);

        if ("VEHICLE_DETAILS".equals(intent.getType())) {
            // Handle vehicle details request
            Long vehicleId = Long.parseLong(intent.getParams()[0]);
            response = chatService.handleVehicleDetailQuery(vehicleId);
            
            // Update conversation context
            sessionData.put("lastVehicleId", vehicleId);
            sessionData.put("lastIntent", "VEHICLE_DETAILS");
            
        } else if ("LOAN_CALCULATION".equals(intent.getType())) {
            // Handle loan calculation request
            Long vehicleId = Long.parseLong(intent.getParams()[0]);
            double downPayment = Double.parseDouble(intent.getParams()[1]);
            response = chatService.calculateLoanPayment(vehicleId, downPayment);
            
            // Update conversation context
            sessionData.put("lastVehicleId", vehicleId);
            sessionData.put("lastDownPayment", downPayment);
            sessionData.put("lastIntent", "LOAN_CALCULATION");
            
        } else if ("LOAN_CALCULATION_PROMPT".equals(intent.getType())) {
            // User wants to calculate loan but didn't provide down payment
            Long vehicleId = Long.parseLong(intent.getParams()[0]);
            response = "How much would you like to put as a down payment for vehicle ID " + vehicleId + "?";
            
            // Update conversation context
            sessionData.put("lastVehicleId", vehicleId);
            sessionData.put("lastIntent", "LOAN_CALCULATION_PROMPT");
            
        } else if ("BRAND_REQUEST".equals(intent.getType())) {
            // Handle brand request
            String brand = intent.getParams()[0];
            vehicles = vehicleService.getVehiclesByBrand(brand);
            response = formatVehicleResponse(vehicles, "brand", brand);
        }
        // Check for basic intents
        else if (containsGreeting(message)) {
            response = responses.get("greeting");
        } 
        else if (message.contains("help") || message.contains("what can you do")) {
            response = responses.get("help");
        }
        else if (containsGoodbye(message)) {
            response = responses.get("goodbye");
        }
        // Check for brand inquiries
        else if (containsBrandNames(message)) {  
            String brand = extractBrand(message);
            if (brand != null) {
                vehicles = vehicleService.getVehiclesByBrand(brand);
                response = formatVehicleResponse(vehicles, "brand", brand);
            } else {
                response = "What brand of vehicle are you interested in?";
            }
        }
        // Check for shape/type inquiries
        else if (message.contains("shape") || message.contains("type") || 
                message.contains("suv") || message.contains("sedan") || 
                message.contains("truck") || message.contains("coupe")) {
            String shape = extractShape(message);
            if (shape != null) {
                vehicles = vehicleService.getVehiclesByShape(shape);
                response = formatVehicleResponse(vehicles, "shape", shape);
            } else {
                response = "What type of vehicle are you looking for? We have sedans, SUVs, trucks, and more.";
            }
        }
        // Check for model year inquiries
        else if (message.contains("year") || message.contains("model year")) {
            Integer year = extractYear(message);
            if (year != null) {
                vehicles = vehicleService.getVehiclesByModelYear(year);
                response = formatVehicleResponse(vehicles, "year", year.toString());
            } else {
                response = "Which model year are you interested in?";
            }
        }
        // Check for deals/sales inquiries
        else if (message.contains("deal") || message.contains("sale") || message.contains("hot deal") || message.contains("discount")) {
            vehicles = vehicleService.getVehiclesByOnSale(true);
            response = formatVehicleResponse(vehicles, "on sale", "true");
        }
        // General inquiry about all vehicles
        else if (message.contains("all") && (message.contains("vehicle") || message.contains("car") || message.contains("inventory"))) {
            vehicles = vehicleService.getAllVehicles("price", "asc");
            response = "Here are all vehicles in our inventory, sorted by price:\n" + formatVehicleList(vehicles, 10);
        }
        else {
            response = responses.get("fallback");
        }
        
        return ResponseEntity.ok(new ChatResponse(response));
    }
    
    // Helper methods from the original ChatbotController...
    private boolean containsGreeting(String message) {
        String[] greetings = {"hello", "hi", "hey", "greetings", "howdy"};
        for (String greeting : greetings) {
            if (message.contains(greeting)) {
                return true;
            }
        }
        return false;
    }
    
    private boolean containsGoodbye(String message) {
        String[] goodbyes = {"bye", "goodbye", "see you", "later", "exit", "quit"};
        for (String goodbye : goodbyes) {
            if (message.contains(goodbye)) {
                return true;
            }
        }
        return false;
    }
    
   private boolean containsBrandNames(String message) {
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
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\b(19|20)\\d{2}\\b");
        java.util.regex.Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group());
        }
        return null;
    }
    
    private Double extractAmount(String message) {
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\$?(\\d+(?:\\.\\d+)?)");
        java.util.regex.Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        }
        return null;
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
            response.append("\nThere are ").append(vehicles.size() - 10).append(" more vehicles. Would you like to see more?");
        }
        
        return response.toString();
    }
    
    private String formatVehicleList(List<Vehicle> vehicles, int limit) {
        StringBuilder result = new StringBuilder();
        int count = 0;
        
        for (Vehicle vehicle : vehicles) {
            if (count >= limit) break;
            
            result.append("- ").append(vehicle.getModelYear()).append(" ")
                  .append(vehicle.getBrand()).append(" (").append(vehicle.getShape()).append(")\n")
                  .append("  Price: $").append(vehicle.getPrice())
                  .append(vehicle.isOnSale() ? " (ON SALE!)" : "").append("\n")
                  .append("  Mileage: ").append(vehicle.getMileage()).append(" miles\n")
                  .append("  Vehicle ID: ").append(vehicle.getVehicleID()).append("\n\n");
            
            count++;
        }
        
        return result.toString();
    }
}

class ChatRequest {
    private String message;
    private String sessionId;
    
    public ChatRequest() {}
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}

class ChatResponse {
    private String response;
    
    public ChatResponse() {}
    
    public ChatResponse(String response) {
        this.response = response;
    }
    
    public String getResponse() {
        return response;
    }
    
    public void setResponse(String response) {
        this.response = response;
    }
}
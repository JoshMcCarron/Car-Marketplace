package com.lebronJamesCars.controller;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lebronJamesCars.entity.Vehicle;
import com.lebronJamesCars.service.VehicleService;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
	
	private final VehicleService vehicleService;
	
	public VehicleController(VehicleService vehicleService) {
		this.vehicleService = vehicleService;
	}
	
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
	public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id){
		Optional<Vehicle> vehicle = vehicleService.getVehicleById(id);
		return vehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	@PostMapping
	public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle){
		Vehicle savedVehicle = vehicleService.createVehicle(vehicle);
		return ResponseEntity.ok(savedVehicle);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle){
		Optional<Vehicle> updatedVehicle = vehicleService.updateVehicle(id, vehicle);
		return updatedVehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());	
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteVehicle(@PathVariable Long id){
		if (vehicleService.deleteVehicle(id)) {
			return ResponseEntity.noContent().build();
		}else {
			return ResponseEntity.notFound().build();
		}
	}
}
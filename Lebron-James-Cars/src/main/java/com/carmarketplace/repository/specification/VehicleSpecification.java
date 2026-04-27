package com.lebronJamesCars.repository.specification;

import com.lebronJamesCars.entity.Vehicle;
import org.springframework.data.jpa.domain.Specification;

public class VehicleSpecification {

    public static Specification<Vehicle> hasBrand(String brand) {
        return (root, query, cb) ->
                (brand == null || brand.isEmpty()) ? null :
                cb.equal(cb.lower(root.get("brand")), brand.toLowerCase());
    }

    public static Specification<Vehicle> hasShape(String shape) {
        return (root, query, cb) ->
                (shape == null || shape.isEmpty()) ? null :
                cb.equal(cb.lower(root.get("shape")), shape.toLowerCase());
    }

    public static Specification<Vehicle> hasModelYear(Integer modelYear) {
        return (root, query, cb) ->
                modelYear == null ? null :
                cb.equal(root.get("modelYear"), modelYear);
    }

    public static Specification<Vehicle> hasVehicleHistory(String vehicleHistory) {
        return (root, query, cb) ->
                (vehicleHistory == null || vehicleHistory.isEmpty()) ? null :
                cb.equal(cb.lower(root.get("vehicleHistory")), vehicleHistory.toLowerCase());
    }

    public static Specification<Vehicle> isOnSale(Boolean onSale) {
        return (root, query, cb) ->
                onSale == null ? null :
                cb.equal(root.get("onSale"), onSale);
    }
}

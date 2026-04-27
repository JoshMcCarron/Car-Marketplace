package com.lebronJamesCars.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.lebronJamesCars.entity.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {

//	//filters
    List<Vehicle> findByBrand(String brand);
    List<Vehicle> findByShape(String shape);
    List<Vehicle> findByModelYear(int modelYear);
    List<Vehicle> findByVehicleHistory(String vehicleHistory);
    List<Vehicle> findByOnSale(boolean onSale);
    


    
    //sorting (price, mileage)
    List<Vehicle> findAll(Sort sort);


}

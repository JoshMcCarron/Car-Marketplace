package com.carmarketplace.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.carmarketplace.entity.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {

//	//filters
    List<Vehicle> findByBrand(String brand);
    List<Vehicle> findByShape(String shape);
    List<Vehicle> findByModelYear(int modelYear);
    List<Vehicle> findByVehicleHistory(String vehicleHistory);
    List<Vehicle> findByOnSale(boolean onSale);
    


    
    //sorting (price, mileage)
    List<Vehicle> findAll(Sort sort);

    // Atomic check-and-decrement: the database only decrements when stock is still positive,
    // so concurrent checkouts can't oversell. Returns 1 if a unit was reserved, 0 if sold out.
    @Modifying(flushAutomatically = true)
    @Query("UPDATE Vehicle v SET v.stock = v.stock - 1 WHERE v.vehicleID = :id AND v.stock > 0")
    int decrementStockIfAvailable(@Param("id") Long id);

}

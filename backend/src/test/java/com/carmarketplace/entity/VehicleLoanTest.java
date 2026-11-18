package com.carmarketplace.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

class VehicleLoanTest {

    private final Vehicle vehicle = new Vehicle();

    @Test
    @DisplayName("calculateLoan: standard amortization over the term in months")
    void monthlyPayment_matchesAmortizationFormula() {
        // $68,000 - $5,000 down at 6.99% APR over 72 months -> $1,073.78/month
        double payment = vehicle.calculateLoan(68000, 5000, 6.99, 72);
        assertThat(payment).isCloseTo(1073.78, within(0.01));
    }

    @Test
    @DisplayName("calculateLoan: payments over the full term repay at least the principal")
    void totalPaid_coversPrincipal() {
        double payment = vehicle.calculateLoan(42000, 2000, 4.99, 60);
        assertThat(payment * 60).isGreaterThan(40000);
    }

    @Test
    @DisplayName("calculateLoan: 0% interest splits the principal evenly over the months")
    void zeroInterest_isPrincipalOverMonths() {
        // $79,000 - $19,000 down at 0% over 60 months -> exactly $1,000/month
        assertThat(vehicle.calculateLoan(79000, 19000, 0.0, 60)).isEqualTo(1000.0);
    }

    @Test
    @DisplayName("calculateLoan: uses the term passed in, not the vehicle's own loanDuration field")
    void usesTermArgument_notField() {
        vehicle.setLoanDuration(12);
        assertThat(vehicle.calculateLoan(12000, 0, 0.0, 60)).isEqualTo(200.0);
    }
}

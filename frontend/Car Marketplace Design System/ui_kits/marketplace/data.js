// Mock data for the UI kit prototype.

window.MOCK_VEHICLES = [
  { id: 1, brand: "Toyota", model: "Corolla", modelYear: 2023, mileage: 24500, price: 18500, shape: "Sedan", fuelUsage: 6.4, co2: "112 g/km", history: "1 owner · clean", onSale: false },
  { id: 2, brand: "Honda", model: "Civic", modelYear: 2022, mileage: 41200, price: 15800, salePrice: 14200, shape: "Sedan", fuelUsage: 6.7, co2: "118 g/km", history: "Service records", onSale: true },
  { id: 3, brand: "Tesla", model: "Model 3", modelYear: 2024, mileage: 8900, price: 38900, shape: "Sedan", fuelUsage: 0, co2: "0 g/km", history: "Single owner", onSale: false },
  { id: 4, brand: "BMW", model: "330i", modelYear: 2021, mileage: 56400, price: 28200, salePrice: 24999, shape: "Sedan", fuelUsage: 7.8, co2: "146 g/km", history: "Premium package", onSale: true },
  { id: 5, brand: "Subaru", model: "Outback", modelYear: 2023, mileage: 18200, price: 26500, shape: "Wagon", fuelUsage: 8.1, co2: "152 g/km", history: "AWD · 1 owner", onSale: false },
  { id: 6, brand: "Mercedes-Benz", model: "C-Class", modelYear: 2022, mileage: 32100, price: 34800, shape: "Sedan", fuelUsage: 7.5, co2: "138 g/km", history: "Lease return", onSale: false },
  { id: 7, brand: "Hyundai", model: "Elantra", modelYear: 2024, mileage: 6200, price: 21400, shape: "Compact", fuelUsage: 6.0, co2: "108 g/km", history: "Like new", onSale: false },
  { id: 8, brand: "Ford", model: "Focus", modelYear: 2020, mileage: 78900, price: 11800, salePrice: 9999, shape: "Compact", fuelUsage: 7.0, co2: "128 g/km", history: "2 owners", onSale: true },
  { id: 9, brand: "Nissan", model: "Altima", modelYear: 2023, mileage: 22400, price: 22900, shape: "Sedan", fuelUsage: 6.9, co2: "124 g/km", history: "Clean carfax", onSale: false },
];

window.MOCK_REVIEWS = [
  { id: 1, author: "Marcus L.", initial: "M", stars: 5, text: "Smooth purchase, the car was exactly as described. Great communication throughout." },
  { id: 2, author: "Priya S.", initial: "P", stars: 4, text: "Solid value. The CO₂ info up front actually helped me decide between two trims." },
  { id: 3, author: "James K.", initial: "J", stars: 5, text: "Picked it up last weekend. Drives like new — and the in‑app chat helped me sort financing in minutes." },
];

window.BRAND_OPTIONS = ["Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Tesla", "Nissan", "Hyundai", "Subaru"];
window.SHAPE_OPTIONS = ["Sedan", "Compact", "Wagon"];
window.YEAR_OPTIONS = [2020, 2021, 2022, 2023, 2024];

export const getAllVehicles = async () => {
    try {
      const response = await fetch("http://18.214.94.81:8080/vehicles"); // Calls backend API
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return [];
    }
  };
  
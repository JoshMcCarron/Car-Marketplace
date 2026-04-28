import api from "./api";

export const getAllVehicles = async () => {
  const response = await api.get("/vehicles");
  return response.data;
};

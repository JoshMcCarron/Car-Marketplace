import HyundaiSedan      from "./HyundaiSedan.webp";
import NissanCompact     from "./NissanCompact.png";
import HondaSedan        from "./HondaSedan.avif";
import TeslaSUV          from "./TeslaSUV.webp";
import SubaruWagon       from "./SubaruWagon.webp";
import FordTruck         from "./FordTruck.jpeg";
import ToyotaSUV         from "./Toyota SUV.jpg";
import ToyotaSedan       from "./ToyotoSedan.webp";
import BMWSedan          from "./BMWSedan.avif";
import MercedesBenzSedan from "./MercedesBenzSedan.webp";

const MAP = {
  "Hyundai_Sedan":       HyundaiSedan,
  "Nissan_Compact":      NissanCompact,
  "Honda_Sedan":         HondaSedan,
  "Tesla_SUV":           TeslaSUV,
  "Subaru_Wagon":        SubaruWagon,
  "Ford_Truck":          FordTruck,
  "Toyota_SUV":          ToyotaSUV,
  "Toyota_Sedan":        ToyotaSedan,
  "BMW_Sedan":           BMWSedan,
  "Mercedes-Benz_Sedan": MercedesBenzSedan,
};

export function getVehicleImage(brand, shape) {
  return MAP[`${brand}_${shape}`] || null;
}

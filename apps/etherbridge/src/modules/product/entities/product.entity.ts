import { Dinero } from "dinero.js";

export interface ProductProperties {
  name: string;
  description: string;
  image?: string;
  unit: string;
  pricePerUnit: Dinero;
  supply: number;
  isFlexible: boolean;
}

import { Dinero } from "dinero.js";
import { PaymentProperties } from "../../payment/entities/payment.entity";
import { ProductProperties } from "../../products/entities/product.entity";
import { PurchaseStatus } from "./purchase-status.enum";

export interface FlexiblePurchaseProperties {
  product: ProductProperties;
  pricePerUnit: Dinero;
  maximumQuantity: number;
  minimumQuantity: number;
  payment: PaymentProperties;
  status: PurchaseStatus;
}

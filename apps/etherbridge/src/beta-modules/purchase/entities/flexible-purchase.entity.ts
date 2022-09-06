import { Dinero } from "dinero.js";
import { PaymentProperties } from "../../../modules/payment/entities/payment.entity";
import { ProductProperties } from "../../product/entities/product.entity";
import { PurchaseStatus } from "./purchase-status.enum";

export interface FlexiblePurchaseProperties {
  product: ProductProperties;
  pricePerUnit: Dinero;
  maximumQuantity: number;
  minimumQuantity: number;
  payment: PaymentProperties;
  status: PurchaseStatus;
}

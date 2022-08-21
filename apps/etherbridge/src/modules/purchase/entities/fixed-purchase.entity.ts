import { Dinero } from "dinero.js";
import { PaymentProperties } from "../../payment/entities/payment.entity";
import { ProductProperties } from "../../products/entities/product.entity";
import { PurchaseStatus } from "./purchase-status.enum";

export interface FixedPurchaseProperties {
  product: ProductProperties;
  quantity: number;
  price: Dinero;
  payment: PaymentProperties;
  status: PurchaseStatus;
}

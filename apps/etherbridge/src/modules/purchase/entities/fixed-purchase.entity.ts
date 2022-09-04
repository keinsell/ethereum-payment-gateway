import { Dinero } from "dinero.js";
import {
  Payment,
  PaymentProperties,
} from "../../payment/entities/payment.entity";
import { ProductProperties } from "../../product/entities/product.entity";
import { PurchaseStatus } from "./purchase-status.enum";

export interface FixedPurchaseProperties {
  product: ProductProperties;
  quantity: number;
  price: Dinero;
  payment: Payment;
  status: PurchaseStatus;
}

import { Payment } from "../../../modules/payment/entities/payment.entity";
import { ProductProperties } from "../../product/entities/product.entity";
import { PurchaseStatus } from "./purchase-status.enum";
import { Dinero } from "dinero.js";

export interface PurchaseProperities {
  product: ProductProperties;
  payment?: Payment;
  units?: number;
  status: PurchaseStatus;
  isFlexible: boolean;
}

/** Flexible Purchase is different kind of purchase where buyer can pay value between two values and get equal product to paid amount. */
export interface FlexiblePurchaseProperties extends PurchaseProperities {
  maximumQuantity: number;
  minimumQuantity: number;
}

/** Fixed Purchases are kind of purchase where buyer is supposed to pay exact value defined by system to recive previously defined product. */
export interface FixedPurchaseProperties extends PurchaseProperities {
  price: Dinero;
}

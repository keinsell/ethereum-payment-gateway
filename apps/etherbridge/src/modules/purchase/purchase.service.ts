import { PaymentGateway } from "../payment/entities/payment-gateway.enum";
import { ProductProperties } from "../product/entities/product.entity";
import { PurchaseProperities } from "./entities/purchase.entity";

export class PurchaseService {
  productService: any;
  paymentService: any;

  /** Create new `Purchase`, with this flow we're supposed to get information about specified product, create new `Purchase` and `Payment` entities. We should also reserve `Product` from available stock, so other people won't be able to make purchase if it's the last example. */
  public async purchaseProduct(
    product: ProductProperties,
    amount: number,
    method: PaymentGateway
  ) {
    // TODO: Get infromation about product
    // TODO: Create new purchase entity
    // TODO: Initialize new payment for such purchase
    // TODO: Return information required to pay for purchase
  }

  // TODO: Cancel ongoing purchase
  public async cancelPurchase(purchase: PurchaseProperities) {}
}

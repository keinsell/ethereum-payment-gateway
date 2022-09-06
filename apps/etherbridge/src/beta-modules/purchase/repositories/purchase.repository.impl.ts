import { PurchaseStatus } from "../entities/purchase-status.enum";

export interface IPurchaseRepository {
  findPurchasesByStatus(status: PurchaseStatus): Promise<unknown>;
}

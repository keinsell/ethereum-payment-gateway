import {
  pendingTransactionListener,
  transactionConfirmationListener,
} from "./modules/old-rotation-wallet/rotation-wallet.service";

export class ApplicationContainer {
  public pendingTransactionSubscription: any;
  public transactionConfirmationSubscription: any;

  constructor() {
    this.pendingTransactionSubscription = pendingTransactionListener;
    this.transactionConfirmationSubscription = transactionConfirmationListener;
  }

  boostrap() {
    this.pendingTransactionSubscription();
    this.transactionConfirmationSubscription();
  }
}

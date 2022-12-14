export enum KnownEvents {
  paymentInitalized = "paymentInitalized",
  paymentWaitingForPayment = "paymentWaitingForPayment",
  paymentUnderpaid = "paymentUnderpaid",
  paymentOverpaid = "paymentOverpaid",
  paymentPaymentRecived = "paymentPaymentRecived",
  paymentPendingConfirmation = "paymentPendingConfirmation",
  paymentConfirmed = "paymentConfirmed",
  paymentRefunded = "paymentRefunded",
  paymentCompleted = "paymentCompleted",
  paymentExpired = "paymentExpired",
  unconfirmedBalanceChange = "unconfirmedBalanceChange",
  confirmedBalanceChange = "confirmedBalanceChange",
}

export interface IDomesticEvent {
  eventName: KnownEvents | string;
  timestamp: Date;
  data: any;
}

export const eventStorage: DomesticEvent[] = [];

export class DomesticEvent implements IDomesticEvent {
  eventName: KnownEvents | string;
  timestamp: Date;
  data: any;

  constructor(kind: KnownEvents | string, data: any) {
    this.eventName = kind;
    this.timestamp = new Date();
    this.data = data;
    this.toConsole();
    this.storeInEventStorage();
  }

  toConsole() {
    console.info(`[${this.timestamp.toISOString()}] ${this.eventName}`);
    console.debug(this.data);
  }

  private storeInEventStorage() {
    eventStorage.push(this);
  }
}

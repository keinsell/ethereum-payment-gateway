import { DomesticEvent } from "../event";

export enum BlockchainEventTypes {
  walletCreated = "wallet-created",
  transactionPosted = "transaction-posted",
  transactionConfirmed = "transaction-confirmed",
}

class WalletCreatedEvent extends DomesticEvent {
  toConsole(): void {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super(BlockchainEventTypes.walletCreated, {});
  }
}

export interface IBlockchainService {
  createWallet(): Promise<unknown>;
}

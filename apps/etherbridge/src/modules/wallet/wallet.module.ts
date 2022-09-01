import { BlockchainModule } from "../blockchain/blockchain.module";
import { WalletRepository } from "./repositories/wallet.repository";
import { WalletService } from "./wallet.service";

export namespace WalletModule {
  export const repository = new WalletRepository();

  export const service = new WalletService(
    BlockchainModule.service,
    repository
  );

  export namespace services {
    export const main = service;
  }

  export namespace repositories {}
}

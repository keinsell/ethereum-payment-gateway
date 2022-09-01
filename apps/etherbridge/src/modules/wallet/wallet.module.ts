import { BlockchainModule } from "../blockchain/blockchain.module";
import { WalletRepository } from "./repositories/wallet.repository";
import { WalletService } from "./wallet.service";

export namespace WalletModule {
  export namespace Repositories {
    export const Prisma = new WalletRepository();
  }
  export namespace Services {
    export const Main = new WalletService(
      BlockchainModule.Services.Ethereum,
      Repositories.Prisma
    );
  }
}

import { IRepository } from "../../../commons/repository/repository.impl";
import { Wallet, WalletProperties } from "../entities/wallet.entity";

export interface IWalletRepository extends IRepository<Wallet> {
  createWallet(properties: WalletProperties): Promise<Wallet>;
}

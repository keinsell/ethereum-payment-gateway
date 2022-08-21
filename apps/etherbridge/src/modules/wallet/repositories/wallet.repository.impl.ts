import { Wallet, WalletProperties } from "../entities/wallet.entity";

export interface IWalletRepository {
  createWallet(properties: WalletProperties): Promise<Wallet>;
}

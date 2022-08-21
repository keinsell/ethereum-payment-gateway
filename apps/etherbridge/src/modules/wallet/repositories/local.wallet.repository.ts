import { Lowdb } from "../../../infrastructure/database/database.infra";

import { Wallet, WalletProperties } from "../entities/wallet.entity";
import { IWalletRepository } from "./wallet.repository.impl";

export class WalletRepository extends Lowdb implements IWalletRepository {
  async createWallet(properties: WalletProperties) {
    const newWallet = new Wallet(properties);
    this.db.data?.wallets.push(newWallet);
    return newWallet;
  }
}

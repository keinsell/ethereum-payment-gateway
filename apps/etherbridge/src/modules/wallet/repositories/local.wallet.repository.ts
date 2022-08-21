import Realm from "realm";
import { realm } from "../../../infrastructure/database/realm/realm.database";
import { Wallet, WalletProperties } from "../entities/wallet.entity";
import { RealmWalletSchema } from "../models/realm.wallet.model";
import { IWalletRepository } from "./wallet.repository.impl";

export class WalletRepository implements IWalletRepository {
  async createWallet(properties: WalletProperties) {
    const newWallet = new Wallet(properties);
    realm.write(() => {
      realm.create<RealmWalletSchema>("Wallet", {
        _id: new Realm.BSON.ObjectId(),
        publicKey: newWallet.address,
        privateKey: newWallet.privateKey,
        isBusy: newWallet.isBusy,
      });
    });

    return newWallet;
  }
}

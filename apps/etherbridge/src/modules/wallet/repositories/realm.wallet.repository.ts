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
        publicKey: newWallet.publicKey,
        privateKey: newWallet.privateKey,
        isBusy: newWallet.isBusy,
      });
    });

    return newWallet;
  }

  async findWalletByAddress(address: string) {
    const wallets = realm.objects<RealmWalletSchema>("Wallet");

    const matchedPublicKey = wallets.filtered(`publicKey = "${address}"`);

    if (matchedPublicKey.length === 0) {
      return null;
    }

    const wallet = matchedPublicKey[0];

    if (!wallet) {
      return null;
    }

    return new Wallet({
      publicKey: wallet?.publicKey,
      privateKey: wallet?.privateKey,
      isBusy: wallet?.isBusy,
    });
  }

  async findUnusedWallet() {
    const wallets = realm.objects<RealmWalletSchema>("Wallet");

    const matchedPublicKey = wallets.filtered("isBusy = false");

    if (matchedPublicKey.length === 0) {
      return null;
    }

    const wallet = matchedPublicKey[0];

    if (!wallet) {
      return null;
    }

    return new Wallet({
      publicKey: wallet?.publicKey,
      privateKey: wallet?.privateKey,
      isBusy: wallet?.isBusy,
    });
  }
}

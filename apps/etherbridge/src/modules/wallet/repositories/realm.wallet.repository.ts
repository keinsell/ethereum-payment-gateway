import Realm from "realm";
import { Entity } from "../../../commons/entity/entity.impl";
import { IMapper } from "../../../commons/mapper/mapper.impl";
import { realm } from "../../../infrastructure/database/realm/realm.database";
import { Wallet, WalletProperties } from "../entities/wallet.entity";
import { RealmWalletMapper } from "../mappers/realm.wallet.mapper";
import { RealmWalletSchema } from "../models/realm.wallet.model";
import { IWalletRepository } from "./wallet.repository.impl";

export class WalletRepository implements IWalletRepository {
  db = realm;
  mapper = new RealmWalletMapper();

  async save(entity: Wallet) {
    const wallet = this.mapper.toEntity(entity);

    const transaction = realm.write(() => {
      const tx = realm.create<RealmWalletSchema>(
        "Wallet",
        wallet,
        Realm.UpdateMode.Modified
      );
      return tx;
    });

    return new Wallet(
      {
        publicKey: transaction.publicKey,
        privateKey: transaction.privateKey,
        isBusy: transaction.isBusy,
      },
      transaction._id.toHexString()
    );
  }

  async exists(entity: Wallet) {
    const wallets = realm.objects<RealmWalletSchema>("Wallet");

    const matchedPublicKey = wallets.filtered(
      `publicKey = "${entity.publicKey}"`
    );

    if (matchedPublicKey.length === 0) {
      return false;
    }

    const wallet = matchedPublicKey[0];

    if (wallet) {
      return true;
    } else {
      return false;
    }
  }

  async delete(entity: Wallet) {
    const wallet = this.mapper.toEntity(entity);
    const doExist = await this.exists(entity);

    if (doExist) {
      realm.write(() => {
        realm.delete(wallet);
      });

      return true;
    } else {
      return false;
    }
  }

  async createWallet(properties: WalletProperties) {
    const newWallet = new Wallet(properties);
    const createdWallet = await this.save(newWallet);
    return createdWallet;
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

    return this.mapper.toDomain(wallet);
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

    return this.mapper.toDomain(wallet);
  }
}

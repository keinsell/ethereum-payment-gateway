import { IMapper } from "../../../commons/mapper/mapper.impl";
import { Wallet } from "../entities/wallet.entity";
import { RealmWalletSchema } from "../models/realm.wallet.model";
import Realm from "realm";

export class RealmWalletMapper implements IMapper {
  toDomain(entity: RealmWalletSchema): Wallet {
    return new Wallet(
      {
        publicKey: entity.publicKey,
        privateKey: entity.privateKey,
        isBusy: entity.isBusy,
      },
      entity._id.toHexString()
    );
  }

  toEntity(domain: Wallet): RealmWalletSchema {
    return {
      _id: new Realm.BSON.ObjectId(),
      publicKey: domain.publicKey,
      privateKey: domain.privateKey,
      isBusy: domain.isBusy,
    };
  }
}

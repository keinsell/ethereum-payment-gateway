import { PersistenceWallet, Prisma } from "prisma-internal";
import { IMapper } from "../../../commons/mapper/mapper.impl";
import { Wallet } from "../entities/wallet.entity";
import Bignumber from "bignumber.js";

export class PrismaWalletMapper implements IMapper {
  toDomain(entity: PersistenceWallet): Wallet {
    return new Wallet(
      {
        publicKey: entity.publicKey,
        privateKey: entity.privateKey,
        isBusy: false,
      },
      entity.id
    );
  }

  toPersistence(entity: Wallet): Prisma.WalletCreateInput {
    return {
      id: new String(entity.id).toString(),
      publicKey: entity.publicKey,
      privateKey: entity.privateKey,
      isBusy: entity.isBusy,
      balance: new Bignumber(entity.balance.toString()).toNumber(),
    };
  }
}

import { IRepository } from "../../../commons/repository/repository.impl";
import { Wallet, WalletProperties } from "../entities/wallet.entity";
import { PrismaConnectionInstance } from "../../../infrastructure/prisma/prisma.infra";
import { PrismaWalletMapper } from "../mappers/wallet.mapper";

export interface IWalletRepository extends IRepository<Wallet> {
  createWallet(properties: WalletProperties): Promise<Wallet>;
}

export class WalletRepository implements IWalletRepository {
  db = PrismaConnectionInstance.wallet;
  mapper = new PrismaWalletMapper();

  async save(entity: Wallet): Promise<Wallet> {
    const doExist = await this.exists(entity);

    const persistenceEntity = this.mapper.toPersistence(entity);

    if (doExist) {
      const updated = await this.db.update({
        where: {
          id: persistenceEntity.id,
        },
        data: persistenceEntity,
      });

      return this.mapper.toDomain(updated);
    }

    persistenceEntity.id = undefined;

    const created = await this.db.create({
      data: persistenceEntity,
    });

    return this.mapper.toDomain(created);
  }

  async exists(entity: Wallet): Promise<boolean> {
    const doExist = await this.db.findUnique({
      where: { id: entity.id.toString() },
    });
    return !!doExist;
  }

  async delete(entity: Wallet): Promise<boolean> {
    const exists = await this.exists(entity);
    if (exists) {
      this.db.delete({
        where: {
          id: this.mapper.toPersistence(entity).id,
        },
      });
      return true;
    } else {
      return false;
    }
  }

  async createWallet(properties: WalletProperties): Promise<Wallet> {
    const wallet = new Wallet(properties);
    return this.save(wallet);
  }
}

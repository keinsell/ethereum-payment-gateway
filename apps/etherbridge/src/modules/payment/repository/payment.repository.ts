import { IMapper } from "../../../commons/mapper/mapper.impl";
import { IRepository } from "../../../commons/repository/repository.impl";
import { PrismaConnectionInstance } from "../../../infrastructure/prisma/prisma.infra";
import { Payment } from "../entities/payment.entity";
import { PrismaPaymentMapper } from "../mappers/payment.mapper";

export class PaymentRepository implements IRepository<Payment> {
  db = PrismaConnectionInstance.payment;
  mapper = new PrismaPaymentMapper();

  async save(entity: Payment): Promise<Payment> {
    if (await this.exists(entity)) {
      const updated = await this.db.update({
        where: {
          id: entity.id.toString(),
        },
        data: this.mapper.toPersistence(entity),
        include: {
          wallet: true,
        },
      });

      return this.mapper.toDomain(updated);
    } else {
      const created = await this.db.create({
        data: this.mapper.toPersistence(entity),
        include: {
          wallet: true,
        },
      });
      return this.mapper.toDomain(created);
    }
  }

  async exists(entity: Payment): Promise<boolean> {
    const doExist = await this.db.findUnique({
      where: {
        id: entity.id.toString(),
      },
    });

    if (doExist) {
      return true;
    } else {
      return false;
    }
  }

  async delete(entity: Payment): Promise<boolean> {
    if (await this.exists(entity)) {
      await this.db.delete({
        where: {
          id: entity.id.toString(),
        },
      });
      return true;
    } else {
      return false;
    }
  }
}

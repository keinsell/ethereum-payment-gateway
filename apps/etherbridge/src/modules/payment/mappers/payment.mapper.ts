import { BigNumber } from "bignumber.js";
import { PersistencePayment } from "prisma-internal";
import { IMapper } from "../../../commons/mapper/mapper.impl";
import { Wallet } from "../../wallet/entities/wallet.entity";
import { PaymentCryptocurrency } from "../entities/payment-currency.enum";
import { PaymentGateway } from "../entities/payment-gateway.enum";
import { PaymentStatus } from "../entities/payment-status.enum";
import { Payment } from "../entities/payment.entity";

export class PrismaPaymentMapper implements IMapper {
  toDomain(entity: PersistencePayment & { wallet: Wallet }): Payment {
    return new Payment(
      {
        amount: new BigNumber(entity.amount.toString()).toNumber(),
        status: entity.status as PaymentStatus,
        currency: PaymentCryptocurrency.eth,
        paid: new BigNumber(0).toNumber(),
        gateway: PaymentGateway.internal,
        creation: new Date(),
        expiration: new Date(),
        wallet: entity.wallet,
      },
      entity.id
    );
  }

  toPersistence(entity: Payment): PersistencePayment {
    return {
      id: entity.id.toString(),
      amount: BigInt(new BigNumber(entity.amount.toString()).toNumber()),
      status: entity.status,
      paid: BigInt(new BigNumber(entity.paid.toString()).toNumber()),
      walletId: entity.wallet.id.toString(),
    };
  }
}

import { ApplicationContainer } from "./container";
import {
  initalizeNewPayment,
  watchPayment,
} from "./deprecated-modules/deprecated-payment/payment.service";
import { BlockchainModule } from "./modules/blockchain/blockchain.module";
import { PrismaConnectionInstance } from "./infrastructure/prisma/prisma.infra";
import { WalletModule } from "./modules/wallet/wallet.module";
import { env } from "process";

const application = new ApplicationContainer();
application.boostrap();

const payment = await initalizeNewPayment();
await watchPayment(payment);

const w = WalletModule.Services.Main;

await w.generateWallet();

import { ApplicationContainer } from "./container";
import {
  initalizeNewPayment,
  watchPayment,
} from "./deprecated-modules/deprecated-payment/payment.service";
import { BlockchainModule } from "./modules/blockchain/blockchain.module";

const application = new ApplicationContainer();
application.boostrap();

const payment = await initalizeNewPayment();
await watchPayment(payment);

const e = BlockchainModule.Services.Ethereum;

e.createWallet();

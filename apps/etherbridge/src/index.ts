import { ApplicationContainer } from "./container";
import {
  initalizeNewPayment,
  watchPayment,
} from "./deprecated-modules/deprecated-payment/payment.service";
import { BlockchainModule } from "./modules/blockchain/blockchain.module";
import { WalletModule } from "./modules/wallet/wallet.module";

const application = new ApplicationContainer();
application.boostrap();

const payment = await initalizeNewPayment();

await watchPayment(payment);

const w = WalletModule.service;
const b = BlockchainModule.service;

await w.generateWallet();

const transaction = await b.createTransaction({
  to: "0x217B1397Da76883d6a8C8b9dF4588D0B69365934",
  value: 1000000000000,
  from: "0xcdfB0772A328da9044D5bfD2D51A47230C9873A4",
});

const singedTransaction = await b.signTransactionWithPrivateKey(
  transaction,
  "0xe7dda5a7fb5b8e3ff6a9341f92fc56bdbc82df13d6894c564af7e884b959ed37"
);

const response = await b.sendSignedTransaction(singedTransaction);

console.log(await response.wait());

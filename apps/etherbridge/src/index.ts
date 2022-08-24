import { err, ok, Result } from "neverthrow";
import { UnexpectedError } from "./commons/error/error.impl";
import { GANACHE_BLOCKCHAIN_CONFIG } from "./config/blockchain.config";
import { ApplicationContainer } from "./container";
import { EthereumLikeService } from "./modules/blockchain/services/networks/ethereum.service";
import { WalletRepository } from "./modules/wallet/repositories/realm.wallet.repository";
import { WalletService } from "./modules/wallet/wallet.service";
import {
  initalizeNewPayment,
  watchPayment,
} from "./modules/old-payment/payment.service";
import { Wallet } from "./modules/wallet/entities/wallet.entity";

const application = new ApplicationContainer();
application.boostrap();

const payment = await initalizeNewPayment();
await watchPayment(payment);

// console.log(wallet);

// function throwik(): Result<string, UnexpectedError> {
//   const random = Math.random();

//   if (random > 0.5) {
//     return err(new UnexpectedError({ xd: "sasfds" }));
//   }

//   return ok("Something");
// }

// const x = throwik();

// const y = x.unwrapOr("default");
// console.log(y);

// const z = x.isErr();
// console.log(z ? x.error.message : undefined);

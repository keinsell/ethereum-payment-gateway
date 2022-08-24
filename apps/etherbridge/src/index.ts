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

const application = new ApplicationContainer();
application.boostrap();

const payment = await initalizeNewPayment();
await watchPayment(payment);

const bs = new EthereumLikeService("ethereum", GANACHE_BLOCKCHAIN_CONFIG);

const w = new WalletService(bs, new WalletRepository());

w.generateWallet();

const walletRepository = new WalletRepository();

const wallet = await walletRepository.findWalletByAddress(
  "0xfeb2df9631839bfdcb806b80514ef4a08466a5499ebb940e2f9327d40ff43fc5"
);

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

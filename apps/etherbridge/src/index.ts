import { GANACHE_BLOCKCHAIN_CONFIG } from "./config/blockchain.config";
import { ApplicationContainer } from "./container";
import { EthereumLikeService } from "./modules/blockchain/services/networks/ethereum.service";
import { WalletRepository } from "./modules/wallet/repositories/realm.wallet.repository";
import { WalletService } from "./modules/wallet/wallet.service";
import { initalizeNewPayment, watchPayment } from "./payment/payment.service";

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

console.log(wallet);

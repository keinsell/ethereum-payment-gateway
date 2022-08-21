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
  "0x5C8a6bA01E69E6F24a8d11A0e502a20E2bf12b26"
);

console.log(wallet);

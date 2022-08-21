import { GANACHE_BLOCKCHAIN_CONFIG } from "./config/blockchain.config";
import { ApplicationContainer } from "./container";
import { EthereumLikeService } from "./modules/blockchain/services/networks/ethereum.service";
import { initalizeNewPayment, watchPayment } from "./payment/payment.service";

const application = new ApplicationContainer();
application.boostrap();

const payment = await initalizeNewPayment();
await watchPayment(payment);

const bs = new EthereumLikeService("ethereum", GANACHE_BLOCKCHAIN_CONFIG);

bs.createWallet();

import { GANACHE_BLOCKCHAIN_CONFIG } from "../../config/blockchain.config";
import { EthereumNetworkService } from "./services/networks/ethereum/ethereum.service";

export namespace BlockchainModule {
  export namespace ValueObjects {}
  export namespace Services {
    export const Ethereum = new EthereumNetworkService(
      "ethereum",
      GANACHE_BLOCKCHAIN_CONFIG
    );
  }
}

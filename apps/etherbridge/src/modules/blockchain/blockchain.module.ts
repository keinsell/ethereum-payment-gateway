import { GANACHE_BLOCKCHAIN_CONFIG } from "../../config/blockchain.config";
import { EthereumNetworkService } from "./services/networks/ethereum/ethereum.service";

export namespace BlockchainModule {
  export namespace services {
    export const ganache = new EthereumNetworkService(
      "ganache",
      GANACHE_BLOCKCHAIN_CONFIG
    );
  }

  export const service = services.ganache;
}

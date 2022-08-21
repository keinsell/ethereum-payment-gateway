import { IBlockchainNetworkService } from "../blockchain/services/networks/blockchain-network.impl";

export class WalletService {
  private NetworkService: IBlockchainNetworkService;

  constructor(NetworkService: IBlockchainNetworkService) {
    this.NetworkService = NetworkService;
  }
}

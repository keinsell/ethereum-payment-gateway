import { IBlockchainNetworkService } from "../blockchain/services/network/network.service.impl";

export class WalletService {
  private NetworkService: IBlockchainNetworkService;

  constructor(NetworkService: IBlockchainNetworkService) {
    this.NetworkService = NetworkService;
  }
}

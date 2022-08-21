import { IBlockchainNetworkService } from "../blockchain/services/networks/blockchain-network.impl";
import { IWalletRepository } from "./repositories/wallet.repository.impl";

export class WalletService {
  private networkService: IBlockchainNetworkService;
  private repository: IWalletRepository;

  constructor(
    NetworkService: IBlockchainNetworkService,
    repository: IWalletRepository
  ) {
    this.networkService = NetworkService;
    this.repository = repository;
  }

  public async generateWallet(): Promise<any> {
    const generatedWallet = this.networkService.createWallet();

    const savedWallet = this.repository.createWallet({
      publicKey: generatedWallet.publicKey,
      privateKey: generatedWallet.privateKey,
      isBusy: false,
      historicalData: [],
    });

    return savedWallet;
  }
}

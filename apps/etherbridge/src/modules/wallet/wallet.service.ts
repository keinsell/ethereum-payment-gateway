import { IBlockchainNetworkService } from "../blockchain/services/networks/blockchain-network.service";
import { Wallet } from "./entities/wallet.entity";
import { IWalletRepository } from "./repositories/wallet.repository";

// TODO: Think about multiple ERC-20 contracts for example, how to synchronize them with wallet.

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

  public async generateWallet(): Promise<Wallet> {
    const generatedWallet = this.networkService.createWallet();

    const savedWallet = this.repository.createWallet({
      publicKey: generatedWallet.publicKey,
      privateKey: generatedWallet.privateKey,
      isBusy: false,
      historicalData: [],
    });

    return savedWallet;
  }

  public async synchronizeWalletBalance(wallet: Wallet): Promise<Wallet> {
    const balance = await this.networkService.getBalanceOfPublicKey(
      wallet.publicKey
    );

    wallet.balance = balance.toString();

    await this.repository.save(wallet);

    // TODO: Add histrical balance record

    return wallet;
  }
}

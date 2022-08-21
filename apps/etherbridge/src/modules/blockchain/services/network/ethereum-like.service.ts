import { ethers } from "ethers";
import Web3 from "web3";
import {
  PrivateKey,
  WalletProperties,
} from "../../value-objects/wallet.blockchain.vo";
import { EthersMapper } from "../../mappers/ethers.mapper";
import { Web3Mapper } from "../../mappers/web3.mapper";
import { TransactionRequest } from "../../value-objects/transaction-request.vo";
import { BlockchainServiceConfiguration } from "../../../../config/blockchain.config";
import { WalletGeneratedEvent } from "../../events/wallet-generated.event";

/** EvmService is universal class that can be used for Ethereum-like networks. */
export class EthereumLikeService {
  /** Generic property which represents name of connected network. */
  private networkName: string;

  /** Object with websocket and rpc connection on Web3 interface. */
  private web3: {
    ws: Web3;
    rpc: Web3;
  };

  /** Object with websocket and rpc connection on ethers interface. */
  private ethers: {
    ws: ethers.providers.WebSocketProvider;
    rpc: ethers.providers.JsonRpcProvider;
  };

  private ethersMapper = new EthersMapper();
  private web3Mapper = new Web3Mapper();

  /** Signer account used as administrator account, it's used as default for some methods like signTransaction where we can skip adding privateKey. */
  private signer: ethers.Signer | undefined;

  constructor(networkName: string, config: BlockchainServiceConfiguration) {
    // Initalize connections for web3
    this.web3 = {
      ws: new Web3(
        new Web3.providers.WebsocketProvider(config.websocketUrl.href)
      ),
      rpc: new Web3(new Web3.providers.HttpProvider(config.rpcUrl.href)),
    };

    if (!(this.web3.ws && this.web3.rpc)) {
      throw new Error("Web3 is not initialized");
    }

    // Initalize connections for ethers
    this.ethers = {
      ws: new ethers.providers.WebSocketProvider(config.websocketUrl.href),
      rpc: new ethers.providers.JsonRpcProvider(config.rpcUrl.href),
    };

    if (!(this.ethers.ws && this.ethers.rpc)) {
      throw new Error("Ethers is not initialized");
    }

    if (config.signerPrivateKey) {
      this.signer = new ethers.Wallet(config.signerPrivateKey);
    }

    this.networkName = networkName;
  }

  /** Create new blockchain wallet. */
  createWallet(): WalletProperties {
    // Create new wallet
    const createdWallet = this.web3.rpc.eth.accounts.create();
    // Log event of created wallet
    new WalletGeneratedEvent(this.networkName, {
      publicKey: createdWallet.address,
      privateKey: createdWallet.privateKey,
    });
    // Return created wallet
    return {
      publicKey: createdWallet.address,
      privateKey: createdWallet.privateKey,
    };
  }

  /** Sign transaction with provided private key of wallet. */
  async signTransactionWithPrivateKey(
    transaction: TransactionRequest,
    privateKey: PrivateKey
  ) {
    // Prepare wallet for signing transaction
    const signer = new ethers.Wallet(privateKey);

    // Map transaction to ethers format
    const _transaction = this.ethersMapper.transactionRequest(transaction);

    // Create signed transaction
    const signedTransaction = await signer.signTransaction(_transaction);

    // Return signed transaction
    return signedTransaction;
  }
}

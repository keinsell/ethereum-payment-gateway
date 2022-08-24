import { BigNumber, ethers } from "ethers";
import Web3 from "web3";
import {
  PrivateKey,
  PublicKey,
  WalletProperties,
} from "../../value-objects/wallet.blockchain.vo";
import { EthersMapper } from "../../mappers/ethers.mapper";
import { Web3Mapper } from "../../mappers/web3.mapper";
import { TransactionRequest } from "../../value-objects/transaction-request.vo";
import { BlockchainServiceConfiguration } from "../../../../config/blockchain.config";
import { WalletGeneratedEvent } from "../../events/wallet-generated.event";
import { IBlockchainNetworkService } from "./blockchain-network.impl";
import { SignedTransaction } from "../../value-objects/singed-transaction.vo";
import { TransactionResponse } from "../../value-objects/transaction-response.vo";
import { ProviderFee } from "../../value-objects/fee-information.vo";
import { TransactionFee } from "../../value-objects/transaction-fee.vo";
import ms from "ms";
import { ConnectedWebsocketEvent } from "../../events/websocket-connection/connected-websocket.event";

// TODO: Add mnemonic to constructor for HDWallet management
// TODO: Add keepAlive to websocket connection
// TODO: Think how to expose pending transactions and how to filter them to other services, that would be useful in maintaining stable architecture.
// https://github.com/ethers-io/ethers.js/issues/1053#issuecomment-808736570

/** EvmService is universal class that can be used for Ethereum-like networks. */
export class EthereumLikeService implements IBlockchainNetworkService {
  /** Generic property which represents name of connected network. */
  private networkName: string;

  /** Object with websocket and rpc connection on Web3 interface. */
  private web3: {
    ws: Web3;
    rpc: Web3;
  };

  /** Object with websocket and rpc connection on ethers interface. */
  private ethers: {
    ws?: ethers.providers.WebSocketProvider;
    rpc: ethers.providers.JsonRpcProvider;
  };

  private mapper: {
    toEthers: EthersMapper;
    toWeb3: Web3Mapper;
  };

  private config: BlockchainServiceConfiguration;

  /** Signer account used as administrator account, it's used as default for some methods like signTransaction where we can skip adding privateKey. */
  private signer: ethers.Signer | undefined;

  constructor(networkName: string, config: BlockchainServiceConfiguration) {
    this.config = config;

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

    if (!this.ethers.rpc) {
      throw new Error("Ethers is not initialized");
    }

    if (config.signerPrivateKey) {
      this.signer = new ethers.Wallet(config.signerPrivateKey);
    }

    this.networkName = networkName;

    // Attach Mappers
    this.mapper = {
      toEthers: new EthersMapper(),
      toWeb3: new Web3Mapper(),
    };

    this.intializeWebsocketConnection();
  }

  intializeWebsocketConnection() {
    console.log(this.config.websocketUrl.href);
    this.ethers.ws = new ethers.providers.WebSocketProvider(
      this.config.websocketUrl.href
    );
    this.ethers.ws.on("pending", async (transactionHash) => {
      console.log(await this.ethers.ws?.getTransaction(transactionHash));
    });

    this.ethers.ws._websocket.on("open", () => {
      new ConnectedWebsocketEvent(this.networkName, this.config.websocketUrl);
    });

    this.ethers.ws._websocket.on("error", (error: any) => {
      console.log("Error...");
      setTimeout(this.intializeWebsocketConnection, ms("3s"));
    });

    this.ethers.ws._websocket.on("close", async (code: number) => {
      console.log(
        `Connection lost with code ${code}! Attempting reconnect in 3s...`
      );

      if (this.ethers.ws) {
        this.ethers.ws._websocket.terminate();
      }

      setTimeout(this.intializeWebsocketConnection, ms("3s"));
    });
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

    // Create signed transaction
    const signedTransaction = await signer.signTransaction(
      this.mapper.toEthers.transactionRequest(transaction)
    );

    // Return signed transaction
    return signedTransaction;
  }

  async signTransaction(
    transactionRequest: TransactionRequest
  ): Promise<string> {
    // Sign transaction with signer account
    return await this.signer!.signTransaction(
      this.mapper.toEthers.transactionRequest(transactionRequest)
    );
  }

  async getBlockNumber(): Promise<number> {
    return await this.web3.rpc.eth.getBlockNumber();
  }

  async getBalanceOfPublicKey(publicKey: PublicKey): Promise<ethers.BigNumber> {
    const balance = await this.ethers.rpc.getBalance(publicKey);
    return balance;
  }

  async getNonceOfPublicKey(publicKey: PublicKey): Promise<number> {
    const nonce = await this.ethers.rpc.getTransactionCount(publicKey);
    return nonce;
  }

  async sendSignedTransaction(
    signedTransaction: SignedTransaction
  ): Promise<TransactionResponse> {
    const transaction = await this.ethers.rpc.sendTransaction(
      signedTransaction
    );

    return transaction;
  }

  async getFeeInformation(
    priority: "normal" | "high" = "normal"
  ): Promise<ProviderFee> {
    const gasPrice = await this.ethers.rpc.getGasPrice();
    const feeData = await this.ethers.rpc.getFeeData();

    // Increase gasPrice by 50% if piority is high
    const gasPriceWithPriority =
      priority === "high" ? gasPrice.mul(1.5) : gasPrice;

    return {
      gasPrice: gasPriceWithPriority,
      maxFeePerGas: feeData.maxFeePerGas ?? undefined,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? undefined,
    };
  }

  async estimateTransactionFee(
    transactionRequest: TransactionRequest,
    fees: ProviderFee
  ): Promise<TransactionFee> {
    const gasLimit = await this.ethers.rpc.estimateGas(
      this.mapper.toEthers.transactionRequest(transactionRequest)
    );

    let totalTransactionCost: BigNumber;

    // Calculate total transaction cost for Type 2 transaction
    if (fees.maxFeePerGas && fees.maxPriorityFeePerGas) {
      totalTransactionCost = fees.maxFeePerGas.mul(gasLimit);
    } else {
      // Calculate total transaction cost for Type 0 transactions
      totalTransactionCost = gasLimit.mul(
        fees.gasPrice ?? (await this.ethers.rpc.getGasPrice())
      );
    }

    return {
      gasLimit: gasLimit,
      totalTransactionCost: totalTransactionCost,
    };
  }
}

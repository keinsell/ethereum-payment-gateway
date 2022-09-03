import { BigNumber, ethers } from "ethers";
import Web3 from "web3";
import { BlockchainServiceConfiguration } from "../../../../../config/blockchain.config";
import { WalletGeneratedEvent } from "../../../events/wallet-generated.event";
import { EthersMapper } from "../../../mappers/ethers.mapper";
import { Web3Mapper } from "../../../mappers/web3.mapper";
import { IProviderFee } from "../../../value-objects/fee-information.vo";
import { ISignedTransaction } from "../../../value-objects/singed-transaction.vo";
import { ITransactionFee } from "../../../value-objects/transaction-fee.vo";
import { ITransactionRequest } from "../../../value-objects/transaction-request.vo";
import { ITransactionResponse } from "../../../value-objects/transaction-response.vo";
import {
  IPrivateKey,
  IPublicKey,
  IWallet,
} from "../../../value-objects/wallet.blockchain.vo";
import { IBlockchainNetworkService } from "../blockchain-network.service";

// TODO: Add mnemonic to constructor for HDWallet management
// TODO: Add keepAlive to websocket connection
// TODO: Think how to expose pending transactions and how to filter them to other services, that would be useful in maintaining stable architecture.
// https://github.com/ethers-io/ethers.js/issues/1053#issuecomment-808736570

/** EthereumNetworkService stands for bare implementation of most EVM-based networks such as Polygon. */
export class EthereumNetworkService implements IBlockchainNetworkService {
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

  /** Signer account used as administrator account, it's used as default for some methods like signTransaction where we can skip adding privateKey. */
  private signer: ethers.Signer | undefined;

  network: string;

  constructor(networkName: string, config: BlockchainServiceConfiguration) {
    this.network = networkName;

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

    this.network = networkName;

    // Attach Mappers
    this.mapper = {
      toEthers: new EthersMapper(),
      toWeb3: new Web3Mapper(),
    };
  }

  /** Create new blockchain wallet. */
  createWallet(): IWallet {
    // Create new wallet
    const createdWallet = this.web3.rpc.eth.accounts.create();
    // Log event of created wallet
    new WalletGeneratedEvent(this.network, {
      publicKey: createdWallet.address,
      privateKey: createdWallet.privateKey,
    });
    // Return created wallet
    return {
      publicKey: createdWallet.address,
      privateKey: createdWallet.privateKey,
    };
  }

  async createTransaction(
    transactionRequest: ITransactionRequest
  ): Promise<ITransactionRequest> {
    // 1. Get provider fee information
    const providerFee = await this.getFeeInformation();
    // 2. Attach fee according to transaction type
    let transactionType = transactionRequest.type;

    if (!transactionType) {
      if (providerFee.maxFeePerGas && providerFee.maxFeePerGas) {
        transactionType = 2;
      } else {
        transactionType = 0;
      }
    }

    transactionRequest = { ...providerFee, ...transactionRequest };

    // 3. Estimate transaction fee and attach it to transaction request
    const transactionFee = await this.estimateTransactionFee(
      transactionRequest,
      providerFee
    );

    transactionRequest = {
      gasLimit: transactionFee.gasLimit,
      ...transactionRequest,
    };

    console.log(transactionRequest);

    // 4. Return transaction request with fee attached
    return transactionRequest;
  }

  /** Sign transaction with provided private key of wallet. */
  async signTransactionWithPrivateKey(
    transaction: ITransactionRequest,
    privateKey: IPrivateKey
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
    transactionRequest: ITransactionRequest
  ): Promise<string> {
    // Sign transaction with signer account
    return await this.signer!.signTransaction(
      this.mapper.toEthers.transactionRequest(transactionRequest)
    );
  }

  async getBlockNumber(): Promise<number> {
    return await this.web3.rpc.eth.getBlockNumber();
  }

  async getBalanceOfPublicKey(
    publicKey: IPublicKey
  ): Promise<ethers.BigNumber> {
    const balance = await this.ethers.rpc.getBalance(publicKey);
    return balance;
  }

  async getNonceOfPublicKey(publicKey: IPublicKey): Promise<number> {
    const nonce = await this.ethers.rpc.getTransactionCount(publicKey);
    return nonce;
  }

  async sendSignedTransaction(
    signedTransaction: ISignedTransaction
  ): Promise<ITransactionResponse> {
    const transaction = await this.ethers.rpc.sendTransaction(
      signedTransaction
    );

    return transaction;
  }

  async getFeeInformation(
    priority: "normal" | "high" = "normal"
  ): Promise<IProviderFee> {
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
    transactionRequest: ITransactionRequest,
    fees: IProviderFee
  ): Promise<ITransactionFee> {
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

import { BigNumberish } from "ethers";
import { GANACHE_BLOCKCHAIN_CONFIG } from "../../../../config/blockchain.config";
import { IProviderFee } from "../../value-objects/fee-information.vo";
import { ISignedTransaction } from "../../value-objects/singed-transaction.vo";
import { ITransactionFee } from "../../value-objects/transaction-fee.vo";
import { ITransactionRequest } from "../../value-objects/transaction-request.vo";
import { ITransactionResponse } from "../../value-objects/transaction-response.vo";
import { ITransaction } from "../../value-objects/transaction.vo";
import {
  IPrivateKey,
  IPublicKey,
  IWallet,
} from "../../value-objects/wallet.blockchain.vo";
import { EthereumNetworkService } from "./ethereum/ethereum.service";

export interface IBlockchainNetworkService {
  /** Describes network connected to service. */
  network: string;

  createWallet(): IWallet;

  /** Create transaction request with included fee configuration. */
  createTransaction(
    transactionRequest: ITransactionRequest
  ): Promise<ITransactionRequest>;

  /** Sign transaction with privateKey attached to class. */
  signTransaction(
    transactionRequest: ITransactionRequest
  ): Promise<ISignedTransaction>;

  /** Sign transaction with provided privateKey. */
  signTransactionWithPrivateKey(
    transactionRequest: ITransaction,
    privateKey: IPrivateKey
  ): Promise<ISignedTransaction>;

  /** Get current block number. */
  getBlockNumber(): Promise<number>;

  /** Get balance of given wallet. (confirmed balance) */
  getBalanceOfPublicKey(publicKey: IPublicKey): Promise<BigNumberish>;

  /** Get number of transaction done by provided public key. */
  getNonceOfPublicKey(publicKey: IPublicKey): Promise<number>;

  /** Send signed transaction. */
  sendSignedTransaction(
    signedTransaction: ISignedTransaction
  ): Promise<ITransactionResponse>;

  /** Get provider's fee information such as gasPrice */
  getFeeInformation(priority: "normal" | "high"): Promise<IProviderFee>;

  /** Estimate fees for transaction. */
  estimateTransactionFee(
    transactionRequest: ITransactionRequest,
    fees: IProviderFee
  ): Promise<ITransactionFee>;
}

export const EthereumService = new EthereumNetworkService(
  "ethereum",
  GANACHE_BLOCKCHAIN_CONFIG
);

import { BigNumber, BigNumberish } from "ethers";
import { SignedTransaction } from "../../value-objects/singed-transaction.vo";
import { TransactionRequest } from "../../value-objects/transaction-request.vo";
import {
  PrivateKey,
  PublicKey,
  WalletProperties,
} from "../../value-objects/wallet.blockchain.vo";
import { ProviderFee } from "../../value-objects/fee-information.vo";
import { TransactionResponse } from "../../value-objects/transaction-response.vo";
import { TransactionFee } from "../../value-objects/transaction-fee.vo";

export interface IBlockchainNetworkService {
  createWallet(): WalletProperties;

  /** Sign transaction with privateKey attached to class. */
  signTransaction(
    transactionRequest: TransactionRequest
  ): Promise<SignedTransaction>;

  /** Sign transaction with provided privateKey. */
  signTransactionWithPrivateKey(
    transactionRequest: TransactionRequest,
    privateKey: PrivateKey
  ): Promise<SignedTransaction>;

  /** Get current block number. */
  getBlockNumber(): Promise<number>;

  /** Get balance of given wallet. (confirmed balance) */
  getBalanceOfPublicKey(publicKey: PublicKey): Promise<BigNumber>;

  /** Get number of transaction done by provided public key. */
  getNonceOfPublicKey(publicKey: PublicKey): Promise<number>;

  /** Send signed transaction. */
  sendSignedTransaction(
    signedTransaction: SignedTransaction
  ): Promise<TransactionResponse>;

  /** Get provider's fee information such as gasPrice */
  getFeeInformation(priority: "normal" | "high"): Promise<ProviderFee>;

  /** Estimate fees for transaction. */
  estimateTransactionFee(
    transactionRequest: TransactionRequest,
    fees: ProviderFee
  ): Promise<TransactionFee>;
}

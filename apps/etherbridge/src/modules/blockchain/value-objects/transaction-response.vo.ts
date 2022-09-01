import { ITransactionReceipt } from "./transaction-receipt.vo";
import { ITransaction } from "./transaction.vo";

export interface ITransactionResponse extends ITransaction {
  hash: string;

  // Only if a transaction has been mined
  blockNumber?: number;
  blockHash?: string;
  timestamp?: number;

  confirmations: number;

  // Not optional (as it is in Transaction)
  from: string;

  // The raw transaction
  raw?: string;

  // This function waits until the transaction has been mined
  wait: (confirmations?: number) => Promise<ITransactionReceipt>;
}

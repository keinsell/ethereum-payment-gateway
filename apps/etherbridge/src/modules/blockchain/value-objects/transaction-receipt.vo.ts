import { BigNumber } from "ethers";

export interface ITransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  gasUsed: BigNumber;
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: any[];
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: BigNumber;
  effectiveGasPrice: BigNumber;
  byzantium: boolean;
  type: number;
  status?: number;
}

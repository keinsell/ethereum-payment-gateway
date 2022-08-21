import { BigNumber } from "ethers";
import { AccessList } from "ethers/lib/utils";

export interface Transaction {
  hash?: string;

  to?: string;
  from?: string;
  nonce: number;

  gasLimit: BigNumber;
  gasPrice?: BigNumber;

  data: string;
  value: BigNumber;
  chainId: number;

  r?: string;
  s?: string;
  v?: number;

  // EIP-1559; Type 2
  maxPriorityFeePerGas?: BigNumber;
  maxFeePerGas?: BigNumber;
}

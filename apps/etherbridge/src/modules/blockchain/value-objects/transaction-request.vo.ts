import { BigNumberish, Bytes, BytesLike, ethers } from "ethers";

export interface TransactionRequest {
  to?: string;
  from?: string;
  nonce?: BigNumberish;

  gasLimit?: BigNumberish;
  gasPrice?: BigNumberish;

  data?: BytesLike;
  value?: BigNumberish;
  chainId?: number;

  type?: number;

  maxPriorityFeePerGas?: BigNumberish;
  maxFeePerGas?: BigNumberish;
}

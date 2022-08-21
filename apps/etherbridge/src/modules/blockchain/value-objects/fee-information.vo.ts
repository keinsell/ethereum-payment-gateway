import { ethers } from "ethers";

export interface ProviderFee {
  gasPrice?: ethers.BigNumber;
  maxFeePerGas?: ethers.BigNumber;
  maxPriorityFeePerGas?: ethers.BigNumber;
}

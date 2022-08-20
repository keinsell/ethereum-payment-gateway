import { BigNumber } from "ethers";

export interface IBlockchainWallet {
  publicKey: string;
  privateKey: string;
  getBalance: () => Promise<BigNumber>;
}

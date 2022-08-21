import { BigNumber } from "ethers";

export type PublicKey = string;
export type PrivateKey = string;

export interface WalletProperties {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

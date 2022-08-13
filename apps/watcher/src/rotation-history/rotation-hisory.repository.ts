import Big from "big.js";
import { IRotationWallet } from "../rotation-wallet/rotation-wallet.repository";

interface RotationWalletHistory {
  timestamp: Date;
  transactionHash?: string;
  blockNumber?: number;
  balance: Big;
  wallet: IRotationWallet;
}

export const RotationWalletHistory: RotationWalletHistory[] = [];

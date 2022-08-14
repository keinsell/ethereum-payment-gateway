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

export function getRotationWalletBalanceSinceDate(
  wallet: IRotationWallet,
  date: Date
) {
  const balance = RotationWalletHistory.filter(
    (history) => history.wallet === wallet && history.timestamp > date
  );

  return balance.reduce((acc, curr) => acc.plus(curr.balance), Big(0));
}

export function getRotationWalletBalanceToDate(
  wallet: IRotationWallet,
  date: Date
) {
  const balance = RotationWalletHistory.filter(
    (history) => history.wallet === wallet && history.timestamp < date
  );

  return balance.reduce((acc, curr) => acc.plus(curr.balance), Big(0));
}

export function accountBalanceChangeOnRotationWallet(
  wallet: IRotationWallet,
  balance: Big
) {
  const history = {
    timestamp: new Date(),
    balance,
    wallet,
  };

  RotationWalletHistory.push(history);

  console.log(RotationWalletHistory);

  return history;
}

export function getBalanceDifferenceSince(date: Date) {
  const balance = RotationWalletHistory.filter(
    (history) => history.timestamp > date
  );

  return balance.reduce((acc, curr) => acc.plus(curr.balance), Big(0));
}

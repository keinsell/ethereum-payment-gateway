import Big from "big.js";
import { IRotationWallet } from "../rotation-wallet/rotation-wallet.repository";

interface RotationWalletHistory {
  timestamp: Date;
  transactionHash?: string;
  blockNumber?: number;
  from?: string;
  isConfirmed?: boolean;
  balance: Big;
  wallet: IRotationWallet;
}

export const RotationWalletHistory: RotationWalletHistory[] = [];

export function getRotationWalletBalanceSinceDate(
  wallet: IRotationWallet,
  date: Date
) {
  const balance = RotationWalletHistory.filter(
    (history) => history.timestamp > date && history.wallet.id === wallet.id
  );

  return balance[0]?.balance;
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
  difference?: Big,
  additional?: {
    transactionHash?: string;
    blockNumber?: number;
    from?: string;
    isConfirmed?: boolean;
  }
) {
  const balance = difference ? wallet.balance.plus(difference) : wallet.balance;

  const history: RotationWalletHistory = {
    timestamp: new Date(),
    balance: balance,
    wallet,
    ...additional,
  };

  RotationWalletHistory.push(history);

  console.log(RotationWalletHistory);

  return history;
}

export function confirmBalanceChangesAfterBlock(block: number) {
  const balance = RotationWalletHistory.filter(
    (history) =>
      history.blockNumber ?? (0 < block && history.isConfirmed === false)
  );

  balance.forEach((history) => {
    history.isConfirmed = true;
  });
}

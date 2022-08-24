import Big from "big.js";
import { nanoid } from "nanoid";
import { DomesticEvent } from "../infrastructure/event";
import { ConfirmedPendingTransactionEvent } from "../old-rotation-wallet/events/confirmed-pending-transaction.event";
import {
  IRotationWallet,
  updateRotationWallet,
} from "../old-rotation-wallet/rotation-wallet.repository";

interface RotationWalletHistory {
  id: string;
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

export function getLatestConfirmedBalanceOnRotationWallet(
  wallet: IRotationWallet
) {
  const balance = RotationWalletHistory.filter(
    (history) => history.isConfirmed && history.wallet.id === wallet.id
  );

  return balance[0]?.balance;
}

export function getLatestUnconfirmedBalanceOnRotationWallet(
  wallet: IRotationWallet
) {
  const balance = RotationWalletHistory.filter(
    (history) => !history.isConfirmed && history.wallet.id === wallet.id
  );

  return balance[0]?.balance;
}

export function getConfirmedBalanceOnRotationWalletToDate(
  wallet: IRotationWallet,
  date: Date
) {
  const balance = RotationWalletHistory.filter(
    (history) =>
      history.isConfirmed &&
      history.timestamp.getTime() > date.getTime() &&
      history.wallet.id === wallet.id
  );

  return balance[0]?.balance;
}

/** Note a change of balance on rotation wallet. */
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
    id: nanoid(128),
    timestamp: new Date(),
    balance: balance,
    wallet,
    ...additional,
  };

  RotationWalletHistory.push(history);

  return history;
}

export function confirmBalanceChangesAfterBlock(block: number) {
  const balance = RotationWalletHistory.filter((history) => {
    if (!history.blockNumber) {
      return true;
    }
    return history.blockNumber < block && !history.isConfirmed;
  });

  balance.forEach((history) => {
    if (history.isConfirmed) {
      return;
    }

    history.isConfirmed = true;

    const index = RotationWalletHistory.findIndex(
      (history) => history.id === history.id
    );

    const wallet = history.wallet;

    wallet.balance = history.balance;

    updateRotationWallet(wallet);

    const transactionHash = RotationWalletHistory[index]?.transactionHash;

    if (transactionHash) {
      new ConfirmedPendingTransactionEvent(transactionHash);
    }

    RotationWalletHistory[index] = history;
  });
}

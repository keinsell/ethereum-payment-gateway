import Big from "big.js";
import { nanoid } from "nanoid";
import { Account } from "web3-core";

export interface IRotationWallet {
  id: string;
  address: string;
  balance: Big;
  unconfirmedBalance?: Big;
  isBusy: boolean;
  privateKey: string;
}

const RotationWalletState: IRotationWallet[] = [];

export function findRotationWalletByAddress(address: string) {
  return RotationWalletState.find((wallet) => wallet.address === address);
}

export function findAvailableRotationWallet() {
  const freeWallet = RotationWalletState.find(
    (wallet) => wallet.isBusy === false
  );

  if (!freeWallet) {
    return;
  }

  return freeWallet;
}

export function markRotationWalletAsBusy(wallet: IRotationWallet) {
  // Set state as busy
  wallet.isBusy = true;
  // Update wallet in RotationWalletState
  RotationWalletState.splice(RotationWalletState.indexOf(wallet), 1, wallet);
  // Return updated
  return wallet;
}

export function createRotationWalletFromAccount(account: Account) {
  const newRotationWallet: IRotationWallet = {
    id: nanoid(),
    balance: Big(0),
    privateKey: account.privateKey,
    address: account.address,
    isBusy: false,
  };

  RotationWalletState.push(newRotationWallet);

  return newRotationWallet;
}

export async function releaseRotationWallet(wallet: IRotationWallet) {
  wallet.isBusy = false;

  RotationWalletState.splice(RotationWalletState.indexOf(wallet), 1, wallet);

  return wallet;
}

export async function updateRotationWallet(wallet: IRotationWallet) {
  // Update wallet balance
  RotationWalletState.splice(RotationWalletState.indexOf(wallet), 1, wallet);

  return wallet;
}

export async function getAllRotationWallets() {
  return RotationWalletState;
}

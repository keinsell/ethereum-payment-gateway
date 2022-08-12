import { Big } from "big.js";
import { nanoid } from "nanoid";
import { createNewEthereumWallet, w3rpc } from "./blockchain";

export interface IRotationWallet {
  id: string;
  address: string;
  balance: Big;
  unconfirmedBalance?: Big;
  isBusy: boolean;
  privateKey: string;
}

const RotationWalletState: IRotationWallet[] = [];

export function getRotationWalletByAddress(address: string) {
  return RotationWalletState.find((wallet) => wallet.address === address);
}

export async function useRotationWallet() {
  // Find busy = false wallet in RotatationWalletState
  const freeWallet = RotationWalletState.find(
    (wallet) => wallet.isBusy === false
  );

  // Mark wallet as busy
  if (freeWallet) {
    freeWallet.isBusy = true;
    // Update wallet in RotationWalletState
    RotationWalletState.splice(
      RotationWalletState.indexOf(freeWallet),
      1,
      freeWallet
    );
  }

  // If there is no free wallet, create new one
  if (!freeWallet) {
    const ethereumWallet = await createNewEthereumWallet();
    const newRotationWallet: IRotationWallet = {
      id: nanoid(),
      address: ethereumWallet.address,
      balance: new Big(0),
      isBusy: true,
      privateKey: ethereumWallet.privateKey,
    };
    RotationWalletState.push(newRotationWallet);
    return newRotationWallet;
  }

  return freeWallet;
}

export async function releaseRotationWallet(wallet: IRotationWallet) {
  wallet.isBusy = false;
  RotationWalletState.splice(RotationWalletState.indexOf(wallet), 1, wallet);
}

export async function updateConfirmedRotationWalletBalance(
  wallet: IRotationWallet
) {
  const balance = await w3rpc.eth.getBalance(wallet.address);
  wallet.balance = new Big(balance);

  // Update wallet balance
  RotationWalletState.splice(RotationWalletState.indexOf(wallet), 1, wallet);

  return wallet;
}

export async function watchForRotationWalletBalanceUpdate(
  wallet: IRotationWallet
) {
  const unconfirmedBalance = new Big(0);
  // Update wallet balance
  RotationWalletState.splice(RotationWalletState.indexOf(wallet), 1, wallet);
}

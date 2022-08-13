import {
  createWallet,
  getBalanceOfAddress,
} from "../blockchain/blockchain.service";
import { DomesticEvent } from "../infra/event";
import {
  createRotationWalletFromAccount,
  findAvailableRotationWallet,
  IRotationWallet,
  markRotationWalletAsBusy,
  updateRotationWallet,
} from "./rotation-wallet.repository";

export function getOrGenerateFreeRotationWallet() {
  let wallet: IRotationWallet | undefined = findAvailableRotationWallet();

  if (!wallet) {
    // Generate new wallet
    const generatedWallet = createWallet();
    wallet = createRotationWalletFromAccount(generatedWallet);
  }

  wallet = markRotationWalletAsBusy(wallet);

  return wallet;
}

export async function updateConfirmedRotationWalletBalance(
  wallet: IRotationWallet
) {
  const balance = await getBalanceOfAddress(wallet.address);

  if (balance.gt(wallet.balance)) {
    new DomesticEvent("confirmedBalanceChanged", {
      difference: balance.minus(wallet.balance),
    });

    wallet.balance = balance;

    updateRotationWallet(wallet);
  }

  return wallet;
}

import Big from "big.js";
import { ethers } from "ethers";
import {
  createWallet,
  estimateFeeForTransaction,
  getBalanceOfAddress,
  getTransactionByHash,
  sendSignedTransaction,
  signAndSendTransaction,
  steamActualBlock,
  streamPendingTransactions,
} from "../blockchain/blockchain.service";
import { DomesticEvent } from "../infra/event";
import {
  accountBalanceChangeOnRotationWallet,
  confirmBalanceChangesAfterBlock,
} from "../rotation-history/rotation-hisory.repository";
import { FoundPendingTransactionEvent } from "./events/pending-transaction-found.event";
import {
  createRotationWalletFromAccount,
  findAvailableRotationWallet,
  findRotationWalletByAddress,
  getAllRotationWallets,
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

  if (balance.gt(wallet.balance) || balance.lt(wallet.balance)) {
    const difference = balance.minus(wallet.balance);

    new DomesticEvent("confirmedBalanceChanged", {
      difference: difference,
    });

    wallet.balance = balance;

    accountBalanceChangeOnRotationWallet(wallet);

    updateRotationWallet(wallet);
  }

  return wallet;
}

export async function pendingTransactionListener() {
  const subscription = streamPendingTransactions();

  subscription.on("data", async (transactionHash) => {
    const transaction = await getTransactionByHash(transactionHash);

    if (transaction.to) {
      const wallet = findRotationWalletByAddress(transaction.to);

      if (wallet) {
        const transactionValue = new Big(
          ethers.utils.formatUnits(transaction.value, 18).toString()
        );

        accountBalanceChangeOnRotationWallet(wallet, transactionValue, {
          from: transaction.from,
          blockNumber: transaction.blockNumber ?? undefined,
          transactionHash: transaction.hash,
          isConfirmed: false,
        });

        new FoundPendingTransactionEvent(transaction, wallet);
      }
    }
  });
}

export async function massPayoutFromRotationWalletsToAddress(address: string) {}

export async function payoutForWalletWithBiggestCapial() {
  const rotationWallets = await getAllRotationWallets();
  const rotationWallet = rotationWallets[0];

  if (!rotationWallet) return null;

  const balance = await getBalanceOfAddress(rotationWallet.address);

  const esimateFee = await estimateFeeForTransaction(
    "0x0E5079117F05C717CF0fEC43ff5C77156395F6E0",
    balance
  );

  console.log(esimateFee);

  const toBeSent = balance.minus(new Big(esimateFee.total));

  if (toBeSent.gt(0)) {
    await signAndSendTransaction(
      rotationWallet.privateKey,
      "0x0E5079117F05C717CF0fEC43ff5C77156395F6E0",
      toBeSent,
      { gasLimit: esimateFee.gasLimit, gasPrice: esimateFee.gasPrice }
    );
  }
}

export async function transactionConfirmationListener() {
  const subscription = steamActualBlock();

  subscription.on("data", async (block) => {
    confirmBalanceChangesAfterBlock(block.number);
  });
}

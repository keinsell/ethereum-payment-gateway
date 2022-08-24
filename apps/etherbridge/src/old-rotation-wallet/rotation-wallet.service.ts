import Big from "big.js";
import { ethers } from "ethers";
import {
  createWallet,
  estimateFeeForTransaction,
  getBalanceOfAddress,
  getNonce,
  getTransactionByHash,
  sendSignedTransaction,
  signTransaction,
  steamActualBlock,
  streamPendingTransactions,
} from "../modules/blockchain/blockchain.service";
import { DomesticEvent } from "../infrastructure/event";
import {
  accountBalanceChangeOnRotationWallet,
  confirmBalanceChangesAfterBlock,
} from "../old-rotation-history/rotation-hisory.repository";
import { toBig, toWei, toWeiFromEther } from "../utilities/decimals.util";
import { FundsWithdrawn } from "./events/funds-withdrawed.event";
import { FoundPendingTransactionEvent } from "./events/pending-transaction-found.event";
import { TransactionPostedEvent } from "./events/transaction-posted.event";
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

export async function withdrawFromRotationWallet(
  rotationWallet: IRotationWallet,
  destination: string
) {
  let balance = toWeiFromEther(rotationWallet.balance);

  const esimateFee = await estimateFeeForTransaction({
    to: "0x0E5079117F05C717CF0fEC43ff5C77156395F6E0",
    value: balance,
  });

  balance = toBig(balance)
    .minus(toWeiFromEther(esimateFee.total))
    .toString();

  const signedTransaction = await signTransaction(
    {
      to: destination,
      value: balance,
      gas: esimateFee.gasLimit,
      gasPrice: esimateFee.gasPrice,
    },
    rotationWallet.privateKey
  );

  if (!signedTransaction) {
    return undefined;
  }

  const transaction = await sendSignedTransaction(signedTransaction);

  updateConfirmedRotationWalletBalance(rotationWallet);

  new FundsWithdrawn(transaction.hash, rotationWallet, transaction);
}

export async function massPayoutFromRotationWalletsToAddress(address: string) {}

export async function payoutForWalletWithBiggestCapial() {
  const rotationWallets = await getAllRotationWallets();
  const rotationWallet = rotationWallets[0];

  if (!rotationWallet) return null;

  await withdrawFromRotationWallet(
    rotationWallet,
    "0x0E5079117F05C717CF0fEC43ff5C77156395F6E0"
  );

  return;
}

export async function transactionConfirmationListener() {
  const subscription = steamActualBlock();

  subscription.on("data", async (block) => {
    confirmBalanceChangesAfterBlock(block.number);
  });
}

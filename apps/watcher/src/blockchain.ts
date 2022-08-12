import Big from "big.js";
import Web3 from "web3";
import { Readable } from "node:stream";
import { ethers } from "ethers";
import { DomesticEvent, KnownEvents } from "./event";

const RPC_URL = "http://localhost:7545";
const WS_URL = "ws://localhost:7545";
const MNEMONIC =
  "witness offer estate arrive angry toss river innocent obtain soccer minor pottery";

interface ISubscriptionFilter {
  toAddress: string;
}

interface IInternalEthereumTransaction {
  transactionHash: string;
  timestamp: Date;
  blockNumber: number;
  balance: Big;
  unconfirmedBalance: Big;
}

export const w3rpc = new Web3(new Web3.providers.HttpProvider(RPC_URL));
export const w3ws = new Web3(new Web3.providers.WebsocketProvider(WS_URL));

export function applyEthereumDecimalsToValue(rawValue: string) {
  return ethers.utils.parseUnits(rawValue, "ether").toString();
}

export async function createNewEthereumWallet() {
  const newAccount = await w3rpc.eth.accounts.create();
  return newAccount;
}

export async function getConfirmationsOfTransaction(transactionHash: string) {
  const transaction = await w3rpc.eth.getTransaction(transactionHash);

  const currentBlock = await w3rpc.eth.getBlockNumber();

  return transaction.blockNumber === null
    ? 0
    : currentBlock - transaction.blockNumber;
}

export async function filterPendingTransaction(
  transactionHash: string,
  filter: ISubscriptionFilter
) {
  const transaction = await w3rpc.eth.getTransaction(transactionHash);

  const doReciverOfTransactionMatchWithFilter =
    transaction.to === filter.toAddress;

  if (doReciverOfTransactionMatchWithFilter) {
    return transaction;
  }

  return undefined;
}

export interface IBalanceChunk {
  address: string;
  balance: string;
  transactionHash: string;
  unconfirmedValue: string;
  confirmations: number;
}

export async function subscribeToEthereumTransactions(
  filter: ISubscriptionFilter
) {
  const pendingTransactionSubscription = w3ws.eth.subscribe(
    "pendingTransactions"
  );

  const stream = new Readable({
    objectMode: true,
    read() {},
  });

  pendingTransactionSubscription.on("data", async (data: string) => {
    const tx = await filterPendingTransaction(data, filter);

    if (tx) {
      const balance = await w3rpc.eth.getBalance(filter.toAddress);

      const confirmantions = await getConfirmationsOfTransaction(data);

      const unconfirmedBalance = new Big(
        applyEthereumDecimalsToValue(tx.value)
      ).toString();

      const combinedBalance = new Big(unconfirmedBalance).add(
        applyEthereumDecimalsToValue(balance)
      );

      const balanceChunk: IBalanceChunk = {
        address: filter.toAddress,
        balance: combinedBalance.toString(),
        transactionHash: data,
        confirmations: confirmantions,
        unconfirmedValue: unconfirmedBalance,
      };

      new DomesticEvent(KnownEvents.unconfirmedBalanceChange, balanceChunk);

      stream.push(balanceChunk);
    }
  });

  return {
    balanceStream: stream,
    close: () => {
      pendingTransactionSubscription.unsubscribe();
    },
  };
}

import Big from "big.js";
import { ethers } from "ethers";
import Web3 from "web3";
import {
  RPC_PROVIDER_URL,
  WEBSOCKET_PROVIDER_URL,
} from "../config/environment";

export interface IBlockchainService {}
export interface IGenericBlockchainWallet {}
export interface IGenericTransaction {
  timestamp: Date;
  transactionHash: string;

  blockNumber: number;
  balance: Big;
}

export const rpc = new Web3(new Web3.providers.HttpProvider(RPC_PROVIDER_URL));

export const ws = new Web3(
  new Web3.providers.WebsocketProvider(WEBSOCKET_PROVIDER_URL)
);

export function createWallet() {
  const newAccount = rpc.eth.accounts.create();
  return newAccount;
}

export async function getTransactionConfirmations(transactionHash: string) {
  const transaction = await rpc.eth.getTransaction(transactionHash);

  const currentBlock = await rpc.eth.getBlockNumber();

  return transaction.blockNumber === null
    ? 0
    : currentBlock - transaction.blockNumber;
}

export async function getBalanceOfAddress(address: string) {
  let balance = await rpc.eth.getBalance(address);

  balance = ethers.utils.formatUnits(balance, 18).toString();

  return new Big(balance);
}

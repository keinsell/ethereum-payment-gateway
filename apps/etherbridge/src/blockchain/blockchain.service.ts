import Big from "big.js";
import { ethers } from "ethers";
import Web3 from "web3";
import { TransactionConfig } from "web3-eth";
import { Wallet } from "web3-eth-accounts";
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

const ethersProvider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER_URL);

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

export async function estimateFeeForTransaction(
  transaction: TransactionConfig
) {
  const gasPrice = await ethersProvider.getGasPrice();
  const gasLimit = await rpc.eth.estimateGas(transaction);

  let total = new Big(gasPrice.toString()).times(gasLimit).toString();

  total = ethers.utils.formatUnits(total, 18).toString();

  return {
    total: new Big(total),
    gasPrice: gasPrice.toString(),
    gasLimit: gasLimit,
  };
}

export async function signTransaction(
  transaction: TransactionConfig,
  privateKey: string
) {
  const wallet = rpc.eth.accounts.privateKeyToAccount(privateKey);
  const signedTransaction = await wallet.signTransaction(transaction);
  return signedTransaction;
}

export async function sendSignedTransaction(transactionString: string) {
  const tx = await rpc.eth.sendSignedTransaction(transactionString);
  console.log(tx);
}

export async function getNonce(address: string) {
  return rpc.utils.toNumber(
    await rpc.eth.getTransactionCount(address, "pending")
  );
}

export function streamPendingTransactions() {
  return ws.eth.subscribe("pendingTransactions");
}

export function steamActualBlock() {
  return ws.eth.subscribe("newBlockHeaders");
}

export async function getTransactionByHash(transactionHash: string) {
  return await ws.eth.getTransaction(transactionHash);
}

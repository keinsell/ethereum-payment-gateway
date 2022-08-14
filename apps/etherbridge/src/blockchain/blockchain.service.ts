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

export async function signAndSendTransaction(
  privateKey: string,
  to: string,
  value: Big,
  fee: { gasLimit: number; gasPrice: string }
) {
  const wallet = rpc.eth.accounts.privateKeyToAccount(privateKey);

  const nonce = await rpc.eth.getTransactionCount(wallet.address);

  const signedTransaction = await wallet.signTransaction({
    to: to,
    value: ethers.utils.parseEther(value.toString()).toString(),
    gas: fee.gasLimit,
    gasPrice: fee.gasPrice,
    nonce: nonce,
  });

  if (signedTransaction.rawTransaction) {
    const tx = await rpc.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    console.log(tx.transactionHash);
  }

  return;
}

export async function sendSignedTransaction(signedTransaction: string) {
  const transactionHash = await rpc.eth.sendSignedTransaction(
    signedTransaction
  );

  return transactionHash;
}

export async function estimateFeeForTransaction(to: string, value: Big) {
  const gasPrice = await rpc.eth.getGasPrice();

  const gasLimit = await rpc.eth.estimateGas({
    to: to,
    value: ethers.utils.parseEther(value.toString()).toString(),
  });

  return {
    total: ethers.utils
      .formatUnits(new Big(gasPrice.toString()).times(gasLimit).toString(), 18)
      .toString(),
    gasPrice: gasPrice,
    gasLimit: gasLimit,
  };
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

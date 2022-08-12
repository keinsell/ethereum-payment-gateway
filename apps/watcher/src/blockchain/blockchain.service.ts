import Big from "big.js";
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

export class BlockchainService {
  ws: Web3;
  rpc: Web3;

  constructor(
    rpcProviderUrl: string = RPC_PROVIDER_URL,
    wsProviderUrl: string = WEBSOCKET_PROVIDER_URL
  ) {
    this.rpc = new Web3(new Web3.providers.HttpProvider(rpcProviderUrl));
    this.ws = new Web3(new Web3.providers.WebsocketProvider(wsProviderUrl));
  }
}

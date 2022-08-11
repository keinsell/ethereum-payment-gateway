import Web3 from "web3";

const RPC_URL = "http://localhost:7545";
const WS_URL = "ws://localhost:7545";
const MNEMONIC =
  "witness offer estate arrive angry toss river innocent obtain soccer minor pottery";

export const w3rpc = new Web3(new Web3.providers.HttpProvider(RPC_URL));
export const w3ws = new Web3(new Web3.providers.WebsocketProvider(WS_URL));

export async function createNewEthereumWallet() {
  const newAccount = await w3rpc.eth.accounts.create();
  return newAccount;
}

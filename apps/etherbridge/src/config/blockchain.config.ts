import { PrivateKey } from "../modules/blockchain/value-objects/wallet.blockchain.vo";

export type BlockchainServiceConfiguration = {
  websocketUrl: URL;
  rpcUrl: URL;
  signerPrivateKey?: PrivateKey;
};

export const GANACHE_BLOCKCHAIN_CONFIG = {
  websocketUrl: new URL("ws://localhost:8545"),
  rpcUrl: new URL("http://localhost:8545"),
};

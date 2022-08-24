import { PrivateKey } from "../modules/blockchain/value-objects/wallet.blockchain.vo";

export type BlockchainServiceConfiguration = {
  websocketUrl: URL;
  rpcUrl: URL;
  signerPrivateKey?: PrivateKey;
  /** Provided mnemonic phase is used for building HD Wallets. */
  mnemonic?: string;
  /** Configuration of blockchain explorer to quickly preview made transactions, used mostly for events and developer-usability. */
  blockchainExplorer?: URL;
};

export const GANACHE_BLOCKCHAIN_CONFIG = {
  websocketUrl: new URL("ws://localhost:8545"),
  rpcUrl: new URL("http://localhost:8545"),
};

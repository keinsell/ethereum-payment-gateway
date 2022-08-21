import { Entity } from "../../../commons/entity/entity.impl";
import {
  PrivateKey,
  PublicKey,
} from "../../blockchain/value-objects/wallet.blockchain.vo";
import { HistoricalVaultProperites } from "../../history/entities/historical-balance.entity";

// TODO: Add network prop to Wallet
export interface WalletProperties {
  publicKey: PublicKey;
  privateKey: PrivateKey;
  isBusy: boolean;
  historicalData?: HistoricalVaultProperites[];
}

export class Wallet extends Entity {
  publicKey: PublicKey;
  privateKey: PrivateKey;
  isBusy: boolean;
  historicalData?: HistoricalVaultProperites[];

  constructor(properties: WalletProperties) {
    super();
    this.publicKey = properties.publicKey;
    this.privateKey = properties.privateKey;
    this.isBusy = properties.isBusy;
    this.historicalData = properties.historicalData;
  }
}

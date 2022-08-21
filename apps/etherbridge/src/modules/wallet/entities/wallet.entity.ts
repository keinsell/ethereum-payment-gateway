import { Entity } from "../../../commons/entity/entity.impl";
import {
  PrivateKey,
  PublicKey,
} from "../../blockchain/value-objects/wallet.blockchain.vo";
import { HistoricalVaultProperites } from "../../history/entities/historical-balance.entity";

export interface WalletProperties {
  address: PublicKey;
  privateKey: PrivateKey;
  isBusy: boolean;
  historicalData: HistoricalVaultProperites[];
}

export class Wallet extends Entity {
  address: PublicKey;
  privateKey: PrivateKey;
  isBusy: boolean;
  historicalData: HistoricalVaultProperites[];

  constructor(properties: WalletProperties) {
    super();
    this.address = properties.address;
    this.privateKey = properties.privateKey;
    this.isBusy = properties.isBusy;
    this.historicalData = properties.historicalData;
  }
}

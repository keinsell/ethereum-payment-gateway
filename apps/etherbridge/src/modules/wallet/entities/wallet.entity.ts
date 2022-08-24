import { BigNumber } from "ethers";
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
  balance?: BigNumber;
  isBusy: boolean;
  historicalData?: HistoricalVaultProperites[];
}

export class Wallet extends Entity implements WalletProperties {
  publicKey: PublicKey;
  privateKey: PrivateKey;
  balance: BigNumber;
  isBusy: boolean;
  historicalData?: HistoricalVaultProperites[];

  constructor(properties: WalletProperties, id?: string) {
    super(id);
    this.publicKey = properties.publicKey;
    this.privateKey = properties.privateKey;
    this.balance = properties.balance ?? BigNumber.from(0);
    this.isBusy = properties.isBusy;
    this.historicalData = properties.historicalData;
  }
}

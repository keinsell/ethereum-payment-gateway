import { BigNumber, BigNumberish } from "ethers";
import { Entity } from "../../../commons/entity/entity.impl";
import {
  IPublicKey,
  IPrivateKey,
} from "../../blockchain/value-objects/wallet.blockchain.vo";
import { WalletHistoricalPoint } from "../../history/entities/historical-balance.entity";

// TODO: Add network prop to Wallet
export interface WalletProperties {
  publicKey: IPublicKey;
  privateKey: IPrivateKey;
  balance?: BigNumberish;
  isBusy: boolean;
  historicalData?: WalletHistoricalPoint[];
}

export class Wallet extends Entity implements WalletProperties {
  publicKey: IPublicKey;
  privateKey: IPrivateKey;
  balance: BigNumberish;
  isBusy: boolean;
  historicalData?: WalletHistoricalPoint[];

  constructor(properties: WalletProperties, id?: string) {
    super(id);
    this.publicKey = properties.publicKey;
    this.privateKey = properties.privateKey;
    this.balance = properties.balance ?? BigNumber.from(0);
    this.isBusy = properties.isBusy;
    this.historicalData = properties.historicalData;
  }
}

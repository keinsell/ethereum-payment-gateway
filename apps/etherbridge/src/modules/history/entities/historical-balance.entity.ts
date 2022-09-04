import BigNumber from "bignumber.js";
import { Entity } from "../../../commons/entity/entity.impl";

export interface WalletHistoricalPointProperties {
  balance: BigNumber;
  timestamp: Date;
  transactionHash?: string;
  block?: number;
}

export class WalletHistoricalPoint extends Entity
  implements WalletHistoricalPointProperties {
  balance: BigNumber;
  timestamp: Date;
  transactionHash?: string | undefined;
  block?: number | undefined;

  constructor(properties: WalletHistoricalPointProperties) {
    super();
    this.balance = properties.balance;
    this.timestamp = properties.timestamp;
    this.transactionHash = properties.transactionHash;
    this.block = properties.block;
  }
}

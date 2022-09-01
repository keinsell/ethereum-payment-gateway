import { BigNumber } from "ethers";
import { IProviderFee } from "./fee-information.vo";

export interface ITransactionFee extends IProviderFee {
  gasLimit: BigNumber;
  totalTransactionCost: BigNumber;
}

import { BigNumber } from "ethers";
import { ProviderFee } from "./fee-information.vo";

export interface TransactionFee extends ProviderFee {
  gasLimit: BigNumber;
  totalTransactionCost: BigNumber;
}

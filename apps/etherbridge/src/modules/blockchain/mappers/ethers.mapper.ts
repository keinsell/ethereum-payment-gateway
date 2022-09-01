import { ethers } from "ethers";
import { ITransactionRequest } from "../value-objects/transaction-request.vo";

export class EthersMapper {
  transactionRequest(
    transactionRequest: ITransactionRequest
  ): ethers.providers.TransactionRequest {
    return {
      ...transactionRequest,
    };
  }
}

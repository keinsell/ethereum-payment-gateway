import { ethers } from "ethers";
import { TransactionRequest } from "../value-objects/transaction-request.vo";

export class EthersMapper {
  transactionRequest(
    transactionRequest: TransactionRequest
  ): ethers.providers.TransactionRequest {
    return {
      ...transactionRequest,
    };
  }
}

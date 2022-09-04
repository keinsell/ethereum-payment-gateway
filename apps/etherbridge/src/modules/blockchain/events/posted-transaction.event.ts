import { BaseEvent } from "../../../commons/event/event.impl";
import { PrettyPrint } from "../../../utilities/pretty-print.utils"
import consola from 'consola'
import { ITransactionResponse } from "../value-objects/transaction-response.vo"

export class TransactionPostedEvent extends BaseEvent<{
  network: string;
  receipt: ITransactionResponse;
}> {
  constructor(network: string, receipt: ITransactionResponse) {
    super(`POSTED_${network.toUpperCase()}_TRANSACTION`, { network, receipt }, "debug", `Posted transaction on ${network.toLowerCase()} network with hash ${receipt.hash}`);
  }

  override toConsole(): void {
    const transactionHash = PrettyPrint.address(this.data.receipt.hash);
    
    const message = `Posted transaction ${transactionHash}`;
    
    consola.info(message);
  }
}
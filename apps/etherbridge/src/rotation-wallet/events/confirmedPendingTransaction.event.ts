import { DomesticEvent } from "../../infra/event"
import consola from 'consola'
import { ConsoleStyle } from "../../utilities/console-colors.util"
import { Transaction } from "web3-eth"

export class ConfirmedPendingTransactionEvent extends DomesticEvent {
    constructor(transactionHash: string, transaction?: Transaction) {
      super("pending-transaction-found", {transactionHash: transactionHash, transaction: transaction});
    }
    override toConsole(): void {
        const message = `Confirmed pending transaction ${ConsoleStyle.identifier(this.data.transactionHash)}`

        consola.success(message)
    }
  }
  
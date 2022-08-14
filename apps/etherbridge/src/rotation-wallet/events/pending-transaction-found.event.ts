import { DomesticEvent } from "../../infra/event"
import consola from 'consola'
import { ConsoleStyle } from "../../utilities/console-colors.util"
import { Transaction } from "web3-eth"
import { IRotationWallet } from "../rotation-wallet.repository"

export class FoundPendingTransactionEvent extends DomesticEvent {
    constructor(transaction: Transaction, wallet: IRotationWallet) {
      super("pending-transaction-found", {transaction: transaction, wallet: wallet});
    }
  
    override toConsole(): void {
        const message = `Found pending transaction ${ConsoleStyle.identifier(this.data.transaction.hash)}`

        consola.success(message)
    }
  }
  
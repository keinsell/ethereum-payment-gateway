import { DomesticEvent } from "../../infra/event"
import consola from 'consola'
import { ConsoleStyle } from "../../utilities/console-colors.util"
import { Transaction } from "web3-eth"
import { IRotationWallet } from "../rotation-wallet.repository"

export class ConfirmedPendingTransactionEvent extends DomesticEvent {
    constructor(transactionHash: string) {
      super("pending-transaction-found", transactionHash);
    }
    override toConsole(): void {
        const message = `Confirmed pending transaction ${ConsoleStyle.identifier(this.data)}`

        consola.success(message)
    }
  }
  
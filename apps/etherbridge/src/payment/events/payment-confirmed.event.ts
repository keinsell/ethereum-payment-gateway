import { DomesticEvent } from "../../infra/event"
import consola from 'consola'
import { ConsoleStyle } from "../../utilities/console-colors.util"
import { Transaction } from "web3-eth"

export class ConfirmedDeclarationPaymentEvent extends DomesticEvent {
    constructor(payment: any, transactionHash?: any) {
      super("confirmed-declaration-payment", {
        payment, transactionHash
      });
    }

    override toConsole(): void {
        const message = `Confirmed purchase payment ${ConsoleStyle.identifier(this.data.payment.id)}`

        consola.success(message)
    }
  }
  
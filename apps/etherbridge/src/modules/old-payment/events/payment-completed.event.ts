import { DomesticEvent } from "../../../infrastructure/event"
import consola from 'consola'
import { ConsoleStyle } from "../../../utilities/console-colors.util"
import { Transaction } from "web3-eth"

export class PaymentCompletedEvent extends DomesticEvent {
    constructor(payment: any) {
      super("payment-completed", {
        payment
      });
    }

    override toConsole(): void {
        const message = `Completed payment ${ConsoleStyle.identifier(this.data.payment.id)}`

        consola.success(message)
    }
  }
  
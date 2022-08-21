import { DomesticEvent } from "../../infrastructure/event"
import consola from 'consola'
import { ConsoleStyle } from "../../utilities/console-colors.util"
import { Transaction } from "web3-eth"

export class PaymentRecivedEvent extends DomesticEvent {
    constructor(payment: any) {
      super("payment-recived", {
        payment
      });
    }

    override toConsole(): void {
        const paymentIdentificator = `${ConsoleStyle.identifier(this.data.payment.id)}`

        const message = `Recived payment for purchase ${paymentIdentificator}`

        consola.success(message)
    }
  }
  
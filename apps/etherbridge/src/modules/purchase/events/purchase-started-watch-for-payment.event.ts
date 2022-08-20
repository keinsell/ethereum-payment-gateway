import { DomesticEvent } from "../../../infra/event"
import consola from 'consola'
import { ConsoleStyle } from "../../../utilities/console-colors.util"

export class PurchaseStartedWaitingForPayment extends DomesticEvent {
    constructor(purchase: any) {
      super("waiting-for-payment", purchase);
    }
  
    override toConsole(): void {
        const message = `Waiting for payment for Purchase ${ConsoleStyle.identifier(this.data.id)}`

        const amountToBePaidMessage = `Amount to be paid: ${ConsoleStyle.amountWithCurrency(this.data.amount.toString(), this.data.currency)}`

        const vaultAddressMessage = `Vault address: ${ConsoleStyle.depoistAddress(this.data.address)}`

        console.info(ConsoleStyle.separator())

        consola.info(message + "\n")
        consola.info(amountToBePaidMessage)
        consola.info(vaultAddressMessage)

        console.info(ConsoleStyle.separator())
    }
  }
  
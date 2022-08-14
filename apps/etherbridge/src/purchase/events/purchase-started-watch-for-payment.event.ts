import { DomesticEvent } from "../../infra/event"
import consola from 'consola'
import { ConsoleStyle } from "../../utilities/console-colors.util"

export class PurchaseStartedWaitingForPayment extends DomesticEvent {
    constructor(purchase: any) {
      super("waiting-for-payment", purchase);
    }
  
    override toConsole(): void {
        const message = `Waiting for payment for Purchase ${ConsoleStyle.identifier(this.data.id)}\n`

        consola.info(message)

        const amountToBePaidMessage = `Amount to be paid: ${ConsoleStyle.amountWithCurrency(this.data.amount.toString(), this.data.currency)}`

        consola.info(amountToBePaidMessage)

        const vaultAddressMessage = `Vault address: ${ConsoleStyle.depoistAddress(this.data.address)} \n`

        consola.info(vaultAddressMessage)
    }
  }
  
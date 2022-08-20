import { DomesticEvent } from "../../../infra/event"
import consola from 'consola'
import { ConsoleStyle } from "../../../utilities/console-colors.util"
import Big from "big.js"

export class PurchaseUnderpaidEvent extends DomesticEvent {
    constructor(purchase: any) {
      super("underpaid", purchase);
    }
  
    override toConsole(): void {
        const message = `Purchase ${ConsoleStyle.identifier(this.data.id)} is underpaid`
    
        const reamingBalance = (this.data.amount as Big).minus((this.data.paid  as Big)).toString()

        const amountToBePaidMessage = `Amount to be paid: ${ConsoleStyle.amountWithCurrency(reamingBalance, this.data.currency)}`

        const vaultAddressMessage = `Vault address: ${ConsoleStyle.depoistAddress(this.data.address)}`

        console.info(ConsoleStyle.separator())
        consola.info(message + "\n")
        consola.info(amountToBePaidMessage)
        consola.info(vaultAddressMessage)
        console.info(ConsoleStyle.separator())
    }
  }
import { DomesticEvent } from "../../infra/event"
import consola from 'consola'
import { ConsoleStyle } from "../../utilities/console-colors.util"
import Big from "big.js"

export class PurchaseOverpaidEvent extends DomesticEvent {
    constructor(purchase: any) {
      super("underpaid", purchase);
    }
  
    override toConsole(): void {
    
        const overpaidBy = (this.data.paid as Big).minus(this.data.amount as Big).toString()

        const message = `Purchase ${ConsoleStyle.identifier(this.data.id)} overpaid by ${ConsoleStyle.amountWithCurrency(overpaidBy, this.data.currency)}`

        consola.info(message)
    }
  }
import { DomesticEvent } from "../../../infra/event";
import consola from 'consola'
import { ConsoleStyle } from "../../../utilities/console-colors.util"

export class PurchaseInitalizedEvent extends DomesticEvent {
  constructor(purchase: any) {
    super("purchaseInitalized", purchase);
  }

  override toConsole(): void {
      consola.success(`Successfully initalized Purchase ${ConsoleStyle.identifier(this.data.id)}`)
  }
}

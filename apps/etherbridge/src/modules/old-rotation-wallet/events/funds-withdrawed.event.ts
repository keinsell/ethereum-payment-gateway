import { DomesticEvent } from "../../../infrastructure/event"
import consola from 'consola'
import { ConsoleStyle } from "../../../utilities/console-colors.util"
import { Transaction } from "web3-eth"
import { IRotationWallet } from "../rotation-wallet.repository"
import { toEther } from "../../../utilities/decimals.util"

export class FundsWithdrawn extends DomesticEvent {
    constructor(transactionHash: string, rotationWallet: IRotationWallet, transaction?: Transaction) {
      super("withdrawedFunds", {transactionHash: transactionHash, transaction: transaction, wallet: rotationWallet});
    }
    override toConsole(): void {
        const message = `Withdrawed ${ConsoleStyle.amountWithCurrency(toEther(this.data.transaction.value.toString()).toString(), "ETH")}`

        const sendFromMessage = `Send from: ${ConsoleStyle.depoistAddress(this.data.wallet.address)}`

        const sendToMessage = `Send to: ${ConsoleStyle.depoistAddress(this.data.transaction.to)}`

        const transactionHashMessage = `Transaction hash: ${
            ConsoleStyle.identifier(this.data.transaction.hash)
        }`
        
        
        consola.log(ConsoleStyle.separator())
        
        consola.info(message)
        consola.info(sendFromMessage)
        consola.info(sendToMessage)
        consola.info(transactionHashMessage)
        
        consola.log(ConsoleStyle.separator())
    }
  }
  
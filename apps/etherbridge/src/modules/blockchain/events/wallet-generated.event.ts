import { WalletProperties } from "../value-objects/wallet.blockchain.vo";
import { BaseEvent } from "../../../commons/event/event.impl";
import { PrettyPrint } from "../../../utilities/pretty-print.utils"
import consola from 'consola'

export class WalletGeneratedEvent extends BaseEvent<{
  network: string;
  wallet: WalletProperties;
}> {
  constructor(network: string, wallet: WalletProperties) {
    super("generated-wallet", { network, wallet }, "debug");
  }

  override toConsole(): void {
    const generatedPublicKey = PrettyPrint.address(this.data.wallet.publicKey);
    
    const message = `Generated new wallet ${generatedPublicKey}`;
    
    consola.info(message);
  }
}
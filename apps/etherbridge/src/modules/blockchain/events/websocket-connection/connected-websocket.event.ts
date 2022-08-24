import { WalletProperties } from "../../value-objects/wallet.blockchain.vo";
import { BaseEvent } from "../../../../commons/event/event.impl";
import { PrettyPrint } from "../../../../utilities/pretty-print.utils"
import consola from 'consola'

export class ConnectedWebsocketEvent extends BaseEvent<{
  network: string;
  websocketUrl: URL;
  additionalData?: any;
}> {
  constructor(network: string, websocketUrl: URL, additionalData?: any) {
    super("connected-websocket", { network, websocketUrl, additionalData }, "debug");
  }

  override toConsole(): void {

    const message = `Connected websocket (ws://${this.data.websocketUrl.host})`;
    
    consola.info(message);
  }
}
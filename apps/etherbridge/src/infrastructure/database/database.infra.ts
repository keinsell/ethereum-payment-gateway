import { JSONFile, Low } from "lowdb/lib";
import { infrastructureConfiguration } from "../../config/infrastructure.config";
import { HistoricalVaultProperites } from "../../modules/history/entities/historical-balance.entity";
import { VaultProperties } from "../../modules/wallet/entities/vault.entity";

interface IDatabaseModule {
  db: any;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export class Lowdb implements IDatabaseModule {
  adapter = new JSONFile<{
    wallets: VaultProperties[];
    purchases: [];
    histroical: HistoricalVaultProperites[];
  }>(infrastructureConfiguration.database.jsonPath);
  db = new Low(this.adapter);

  constructor() {
    this.db.read();
  }

  async connect() {
    return await this.db.read();
  }

  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

import { HistoricalVaultProperites } from "../../history/entities/historical-balance.entity";

export interface VaultProperties {
  address: string;
  isBusy: false;
  privateKey: string;
  historicalData: HistoricalVaultProperites[];
}

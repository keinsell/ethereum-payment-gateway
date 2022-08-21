import Realm from "realm";
import { WalletObjectSchema } from "../../../modules/wallet/models/realm.wallet.model";

export const realm = await Realm.open({
  path: ".cache/realm/db.realm",
  schema: [WalletObjectSchema],
});

import { BSON, ObjectSchema } from "realm";

export const WalletObjectSchema: ObjectSchema = {
  name: "Wallet",
  properties: {
    _id: "objectId",
    publicKey: "string",
    privateKey: "string",
    isBusy: "bool",
  },
};

export type RealmWalletSchema = {
  _id: BSON.ObjectId;
  publicKey: string;
  privateKey: string;
  isBusy: boolean;
};

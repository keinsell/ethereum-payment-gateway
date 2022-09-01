export type IPublicKey = string;
export type IPrivateKey = string;

export interface IWallet {
  publicKey: IPublicKey;
  privateKey: IPrivateKey;
}

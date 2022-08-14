import Big from "big.js";
import { ethers } from "ethers";

export type InternalBigNuberish =
  | number
  | string
  | ethers.BigNumber
  | ethers.BigNumberish
  | Big;

export function toBig(value: InternalBigNuberish): Big {
  return new Big(value.toString());
}

export function toWeiFromEther(value: InternalBigNuberish): string {
  return ethers.utils.parseEther(value.toString()).toString();
}

export function toWei(
  value: number | string | ethers.BigNumber | ethers.BigNumberish
): Big {
  const ether = toBig(value).toString();
  return toBig(ethers.utils.parseEther(ether));
}

export function toEther(
  value: number | string | ethers.BigNumber | ethers.BigNumberish
): Big {
  const wei = toBig(value).toString();
  return toBig(ethers.utils.formatEther(wei));
}

export function toGwei(
  value: number | string | ethers.BigNumber | ethers.BigNumberish
): Big {
  const wei = toBig(value).toString();
  return toBig(ethers.utils.formatUnits(wei, "gwei"));
}

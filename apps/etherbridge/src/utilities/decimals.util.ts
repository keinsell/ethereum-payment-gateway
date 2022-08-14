import Big from "big.js";
import { ethers } from "ethers";

export function toBig(
  value: number | string | ethers.BigNumber | ethers.BigNumberish
): Big {
  return new Big(value.toString());
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

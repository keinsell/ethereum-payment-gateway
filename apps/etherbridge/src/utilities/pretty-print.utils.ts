import chalk from "chalk";

export namespace PrettyPrint {
  export function address(address: string) {
    return `${chalk.gray(address)}`;
  }
}

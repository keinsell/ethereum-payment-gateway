import chalk from "chalk";

export namespace ConsoleStyle {
  export function identifier(identifier: string) {
    return `${chalk.yellow(identifier)}`;
  }
  export function amountWithCurrency(amount: string, currency: string) {
    return `${chalk.gray(amount)} ${chalk.gray(currency)}`;
  }

  export function depoistAddress(address: string) {
    return `${chalk.gray(address)}`;
  }
}

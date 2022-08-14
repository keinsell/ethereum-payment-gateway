import chalk from "chalk";

export namespace ConsoleStyle {
  export function identifier(identifier: string) {
    return `${chalk.gray(identifier)}`;
  }
  export function amountWithCurrency(amount: string, currency: string) {
    return `${chalk.yellowBright(amount)} ${chalk.yellowBright(currency)}`;
  }

  export function depoistAddress(address: string) {
    return `${chalk.yellowBright(address)}`;
  }

  export function separator() {
    const separate = "-".repeat(60);
    return `${chalk.black(separate)}`;
  }
}

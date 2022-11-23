import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

export { PrismaClient, Prisma } from "@prisma/client";
export type {Wallet as PersistenceWallet, User as PersistenceUser, Event as PresistenceEvent, Payment as PersistencePayment} from '@prisma/client'

if (process.env["NODE_ENV"] !== "production") {
  global.prisma = prisma;
}

import { PrismaClient } from "prisma-internal";

const PrismaConnectionInstance = new PrismaClient();
await PrismaConnectionInstance.$connect();

export { PrismaConnectionInstance };

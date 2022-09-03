import { PrismaClient } from "prisma-internal";

// TODO(#33): When database is turned off on system startup, software will throw an error and ocassionally crash. - https://github.com/keinsell/etherbridge/issues/33
const PrismaConnectionInstance = new PrismaClient();
await PrismaConnectionInstance.$connect();

export { PrismaConnectionInstance };

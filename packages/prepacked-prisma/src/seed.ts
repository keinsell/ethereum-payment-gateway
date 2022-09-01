import { prisma } from ".";

import type { Prisma } from "@prisma/client";

const DEFAULT_USERS: Prisma.UserCreateInput[] = [
  // Add your own user to pre-populate the database with
  {
    firstName: "Jakub",
    lastName: "Olan",
    username: "keinsell",
    email: "example.com",
    password: "password",
  },
];

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  try {
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            username: user.username!,
          },
          update: {
            ...user,
          },
          create: {
            ...user,
          },
        })
      )
    );
  } catch (error) {
    console.error(error);
    return;
  } finally {
    await prisma.$disconnect();
  }
})();

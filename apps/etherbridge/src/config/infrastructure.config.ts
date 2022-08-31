import { join } from "node:path";
export const infrastructureConfiguration = {
  database: {
    jsonPath: join(__dirname, "db.json"),
  },
};

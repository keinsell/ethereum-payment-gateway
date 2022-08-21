import { join, dirname } from "node:path";
export const infrastructureConfiguration = {
  database: {
    jsonPath: join(__dirname, "db.json"),
  },
};

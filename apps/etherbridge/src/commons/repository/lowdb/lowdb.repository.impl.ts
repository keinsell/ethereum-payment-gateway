import { Lowdb } from "../../../infrastructure/database/database.infra";
import { IRepository } from "../repository.impl";

export class LowdbRepository implements IRepository {
  db = new Lowdb().db;
}

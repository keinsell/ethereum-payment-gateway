import { IMapper } from "../mapper/mapper.impl";

export interface IRepository<T> {
  db: unknown;
  mapper?: IMapper;
  /** Save (create or update) given entity in persistence layer. */
  save(entity: T): Promise<T>;
  /** Check if given entity exists in persistence layer. */
  exists(entity: T): Promise<boolean>;
  /** Delete given entity from persistence layer. */
  delete(entity: T): Promise<boolean>;
}

import { IMapper } from "../mapper/mapper.impl";

export interface IRepository<T> {
  db: unknown;
  mapper?: IMapper;
  save(entity: T): Promise<T>;
  exists(entity: T): Promise<boolean>;
  delete(entity: T): Promise<boolean>;
}

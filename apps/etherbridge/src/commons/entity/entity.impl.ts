import { nanoid } from "nanoid";

export abstract class Entity {
  id: string;
  constructor(id?: string) {
    this.id = id ?? nanoid();
  }
}

import { nanoid } from "nanoid";

export abstract class Entity {
  id: string;
  constructor() {
    this.id = nanoid();
  }
}

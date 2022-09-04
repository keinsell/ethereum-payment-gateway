import { PrismaConnectionInstance } from "../../infrastructure/prisma/prisma.infra";

export interface IEvent {
  timestamp: Date;
  event: string;
  description?: string;
  level: "error" | "info" | "debug" | "warn";
  data: any;
}

export class BaseEvent<T = any> implements IEvent {
  timestamp: Date;
  event: string;
  description?: string;
  level: "error" | "info" | "debug" | "warn";
  data: T;

  constructor(
    event: string,
    data: T,
    level: "error" | "info" | "debug" | "warn" = "info",
    description?: string
  ) {
    this.timestamp = new Date();
    this.event = event;
    this.data = data;
    this.level = level;
    this.description = description;
    this.toConsole();
    this.storeInEventStorage();
  }

  toConsole() {
    console.info(`[${this.timestamp.toISOString()}] ${this.event}`);
    console.debug(this.data);
  }

  private async storeInEventStorage() {
    // Save occured event in Prisma
    await PrismaConnectionInstance.event.create({
      data: {
        timestamp: this.timestamp,
        event: this.event,
        level: this.level,
        description: this.description,
        raw_information: JSON.stringify(this.data),
      },
    });
  }
}

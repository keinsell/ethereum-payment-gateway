export interface IEvent {
  timestamp: Date;
  event: string;
  level: "error" | "info" | "debug" | "warn";
  data: any;
}

const EventStorage = [];

export class BaseEvent<T = any> implements IEvent {
  timestamp: Date;
  event: string;
  level: "error" | "info" | "debug" | "warn";
  data: T;

  constructor(
    event: string,
    data: T,
    level: "error" | "info" | "debug" | "warn" = "info"
  ) {
    this.timestamp = new Date();
    this.event = event;
    this.data = data;
    this.level = level;
    this.toConsole();
    this.storeInEventStorage();
  }

  toConsole() {
    console.info(`[${this.timestamp.toISOString()}] ${this.event}`);
    console.debug(this.data);
  }

  private storeInEventStorage() {
    EventStorage.push(this);
  }
}

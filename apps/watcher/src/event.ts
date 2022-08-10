export interface IDomesticEvent {
  eventName: string;
  timestamp: Date;
  data: any;
}

export const eventStorage: DomesticEvent[] = [];

export abstract class DomesticEvent implements IDomesticEvent {
  eventName: string;
  timestamp: Date;
  data: any;

  constructor(kind: string, data: any) {
    this.eventName = kind;
    this.timestamp = new Date();
    this.data = data;
    this.toConsole();
    eventStorage.push(this);
  }

  abstract toConsole(): void;
}

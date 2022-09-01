import { Err } from "neverthrow";
import { DomainResult } from "../result/result.impl";

// https://khalilstemmler.com/articles/enterprise-typescript-nodejs/functional-error-handling/

interface DomainError {
  message: string;
  timestamp: Date;
  error?: any;
}

export class ExpectedDomainError implements DomainError {
  timestamp: Date;
  message: string;
  error?: any;
  constructor(message: string, error?: any, transaction?: any) {
    this.message = message;
    this.error = error;
    this.timestamp = new Date();
  }
}

export class UnexpectedError implements DomainError {
  message: string;
  timestamp: Date;
  error?: any;

  public constructor(error?: any) {
    this.message = "Unexpected error";
    this.timestamp = new Date();
    this.error = error;
  }
}

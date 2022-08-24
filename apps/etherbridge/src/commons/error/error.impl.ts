import { Err } from "neverthrow";
import { DomainResult } from "../result/result.impl";

interface DomainError {
  message: string;
  timestamp: Date;
  error?: any;
}

// export class UnexpectedError extends DomainResult<never, DomainError> {
//   public constructor(error?: any) {
//     super(false, {
//       message: "Unexpected error",
//       timestamp: new Date(),
//       error: error,
//     });
//   }

//   public static from(error: any): UnexpectedError {
//     return new UnexpectedError(error);
//   }
// }

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

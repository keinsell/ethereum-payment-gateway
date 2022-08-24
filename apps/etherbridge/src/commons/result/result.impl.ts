// Result should be used from neverthrow. Code contained in file is most likely deperecated.

import { Err, Ok, Result as NeverResult } from "neverthrow";

export class DomainResult<T, E> {
  public isSuccess: boolean;
  public isFailure: boolean;
  protected error: E | undefined;
  protected ok: T | undefined;
  public result: NeverResult<T, E>;
  public constructor(isSuccess: boolean, value: T | E) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;

    this.error = this.isFailure ? (value as E) : undefined;
    this.ok = this.isSuccess ? (value as T) : undefined;

    this.result = this.isSuccess
      ? new Ok(this.ok as T)
      : new Err(this.error as E);
  }
}

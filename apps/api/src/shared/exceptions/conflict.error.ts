import { ErrorBase } from './error.base';
import { ErrorEnum } from './errorenum';

export class ConflictError extends ErrorBase {
  constructor(message: string) {
    super(message, ErrorEnum.CONFLICT);
  }
}

import { ErrorBase } from './error.base';
import { ErrorEnum } from './errorenum';

export class UnauthorizedError extends ErrorBase {
  constructor(message: string) {
    super(message, ErrorEnum.UNAUTHORIZED);
  }
}

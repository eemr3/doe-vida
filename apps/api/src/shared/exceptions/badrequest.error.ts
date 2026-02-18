import { ErrorBase } from './error.base';
import { ErrorEnum } from './errorenum';

export class BadRequestError extends ErrorBase {
  constructor(message: string) {
    super(message, ErrorEnum.BAD_REQUEST);
  }
}

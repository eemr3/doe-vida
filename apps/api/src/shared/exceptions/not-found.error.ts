import { ErrorBase } from './error.base';
import { ErrorEnum } from './errorenum';

export class NotFoundError extends ErrorBase {
  constructor(message: string) {
    super(message, ErrorEnum.NOT_FOUND);
  }
}

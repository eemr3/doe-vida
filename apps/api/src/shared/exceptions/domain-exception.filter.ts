import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '../exceptions/domain.exception';
import { ErrorBase } from './error.base';

@Catch(ErrorBase)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: ErrorBase, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(
      `${request.method} ${request.url} → ${exception.statusCode} | ${exception.message}`,
    );

    response.status(exception.statusCode).json({
      statusCode: exception.statusCode,
      message: exception.message,
    });
  }
}

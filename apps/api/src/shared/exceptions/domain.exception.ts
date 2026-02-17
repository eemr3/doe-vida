export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class NotFoundException extends DomainException {}
export class ConflictException extends DomainException {}
export class BadRequestException extends DomainException {}
export class UnauthorizedException extends DomainException {}
export class ForbiddenException extends DomainException {}
export class ServiceUnavailableException extends DomainException {}
export class GatewayTimeoutException extends DomainException {}

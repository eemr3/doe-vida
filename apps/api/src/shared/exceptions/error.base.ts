export class ErrorBase extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name; // ← boa prática
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype); // ← fix herança com TypeScript
  }
}

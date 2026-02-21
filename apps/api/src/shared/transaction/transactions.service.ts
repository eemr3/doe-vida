import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

export const TRANSACTIONS_SERVICE = 'TRANSACTIONS_SERVICE';

export interface ITransactionsService {
  run<T>(fn: (manager: EntityManager) => Promise<T>): Promise<T>;
}

@Injectable()
export class TransactionsService implements ITransactionsService {
  constructor(private readonly dataSource: DataSource) {}
  run<T>(fn: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(fn);
  }
}

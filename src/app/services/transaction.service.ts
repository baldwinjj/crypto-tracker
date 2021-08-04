import { Injectable } from '@angular/core';
import {ITransaction} from "../interfaces/ITransaction";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  /** In Memory store of transactions */
  private transactions: ITransaction[] = []

  constructor() { }

  getTransactions(): Observable<ITransaction[]> {
    return of(this.transactions);
  }

  createTransaction(transaction: ITransaction) {
    this.transactions.push(transaction);
  }

  deleteTransaction(index: number) {
    this.transactions.splice(index, 1);
  }

  updateTransaction(index: number, transaction: ITransaction) {
    this.transactions[index] = transaction;
  }
}

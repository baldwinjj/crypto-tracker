import { Injectable } from '@angular/core';
import {ITransaction} from "../interfaces/ITransaction";
import {merge, Observable, of, Subject, timer} from "rxjs";
import {ICalculatedTransaction} from "../interfaces/ICalculatedTransaction";
import {RateService} from "./rate.service";
import {map, shareReplay, switchMap, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private REFRESH_INTERVAL = 120000;
  private update$ = new Subject<void>();
  /** In Memory store of transactions */
  private transactions: ITransaction[] = [{ merchant: 'test', item: 'test', amount: 20, currency: 'BTC' }]

  constructor(
    private rateService: RateService
  ) { }

  getCalculatedTransactions(): Observable<ICalculatedTransaction[]> {
    return merge(this.update$, timer(0, this.REFRESH_INTERVAL)).pipe(
      switchMap(() => this.getTransactions()),
      switchMap(transactions => {
        const codes = transactions.map(({ currency }) => currency)
        if (codes.length) {
          return this.rateService.getRates(codes).pipe(
            map(ratesMap => transactions.map(transaction => ({
              ...transaction,
              price: ratesMap[transaction.currency].rate,
              fiat: transaction.amount * ratesMap[transaction.currency].rate
            })))
          )
        } else {
          return of([])
        }
      }),
      shareReplay(1)
    )
  }

  getTransactions(): Observable<ITransaction[]> {
    return of(this.transactions);
  }

  createTransaction(transaction: ITransaction): Observable<ITransaction> {
    this.transactions.unshift(transaction);
    return of(transaction).pipe(tap(() => this.update$.next()));
  }

  deleteTransaction(index: number): Observable<null> {
    this.transactions.splice(index, 1);
    return of(null).pipe(tap(() => this.update$.next()));
  }

  updateTransaction(index: number, transaction: ITransaction): Observable<null> {
    this.transactions[index] = transaction;
    return of(null).pipe(tap(() => this.update$.next()));
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrencyService} from "../../services/currency.service";
import {combineLatest, Observable, Subject} from "rxjs";
import {ICurrency} from "../../interfaces/ICurrency";
import {map, shareReplay, startWith, switchMap, takeUntil, tap} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TransactionService} from "../../services/transaction.service";
import {ITransaction} from "../../interfaces/ITransaction";
import {ICalculatedTransaction} from "../../interfaces/ICalculatedTransaction";
import {RateService} from "../../services/rate.service";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  editIndex: number | null = null;
  editForm: FormGroup = this.createForm();
  editPrice$ = new Subject<number>();
  editFiat$ = new Subject<number>();

  currencyCodes$: Observable<ICurrency['code'][]> = this.currencyService.getCurrencies().pipe(
    map((currencies) => currencies.filter(({chain, code}) => chain === code)),
    map((currencies) => currencies.map(({code}) => code) ),
    shareReplay(1)
  )

  transactions$: Observable<ICalculatedTransaction[]> = this.transactionService.getCalculatedTransactions();

  constructor(
    private currencyService: CurrencyService,
    private formBuilder: FormBuilder,
    private rateService: RateService,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {}

  async saveTransaction() {
    const transaction: ITransaction = this.editForm.value;
    await this.transactionService.createTransaction(transaction).toPromise();
    this.editIndex = null;
  }

  async updateTransaction(index: number) {
    const transaction: ITransaction = this.editForm.value;
    await this.transactionService.updateTransaction(index, transaction).toPromise();
    this.editIndex = null;
  }

  async deleteTransaction(index: number) {
    await this.transactionService.deleteTransaction(index).toPromise();
  }

  onAddTransaction() {
    this.editIndex = -1;
    this.editForm = this.createForm();
  }

  onEditTransaction(index: number, transaction: ITransaction) {
    this.editIndex = index;
    this.editForm = this.createForm();
    this.editForm.patchValue(transaction);
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      merchant: [null, Validators.required],
      item: [null, Validators.required],
      amount: [null, Validators.required],
      currency: [null, Validators.required]
    })
    this.unsubscribe$.next()
    form.controls.currency.valueChanges.pipe(
      switchMap((currency) => this.rateService.getRate(currency)),
      map(({rate}) => rate),
      takeUntil(this.unsubscribe$)
    ).subscribe(value => this.editPrice$.next(value))
    combineLatest([
      this.editPrice$,
      form.controls.amount.valueChanges
    ]).pipe(
      map(([rate, amount]) => rate * amount),
      startWith(0),
      takeUntil(this.unsubscribe$)
    ).subscribe(value => this.editFiat$.next(value))
    return form;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
  }

}

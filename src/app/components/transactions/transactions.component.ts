import { Component, OnInit } from '@angular/core';
import {CurrencyService} from "../../services/currency.service";
import {Observable} from "rxjs";
import {ICurrency} from "../../interfaces/ICurrency";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  currencyCodes$: Observable<ICurrency['code'][]> = this.currencyService.getCurrencies().pipe(
    map((currencies) => currencies.map(({code}) => code) )
)

  constructor(
    private currencyService: CurrencyService
  ) { }

  ngOnInit(): void {}

}

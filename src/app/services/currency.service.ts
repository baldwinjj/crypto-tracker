import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ICurrency} from "../interfaces/ICurrency";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  CURRENCY_URL = 'https://bitpay.com/currencies';

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Returns a list of available currencies from the API
   */
  getCurrencies(): Observable<ICurrency[]> {
    return this.httpClient.get<{ data: ICurrency[] }>(this.CURRENCY_URL)
      .pipe(map(({ data }) => data))
  }
}

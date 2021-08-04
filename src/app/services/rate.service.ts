import { Injectable } from '@angular/core';
import {ICurrency} from "../interfaces/ICurrency";
import {IRate} from "../interfaces/IRate";
import {forkJoin, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RateService {
  RATE_URL = 'https://bitpay.com/api/rates/'

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Returns a map of rates
   * @param codes
   */
  getRates(codes: ICurrency['code'][]): Observable<{ [key: string]: IRate }> {
    const urlMap = codes.reduce((acc, code) => ({
      ...acc,
      [code]: this.getRate(code)
    }), {})
    return forkJoin(urlMap)
  }

  /**
   * Returns a rate for a single code
   * @param code
   */
  getRate(code: ICurrency['code']): Observable<IRate> {
    return this.httpClient.get<IRate>(this.RATE_URL + code + '/USD')
  }
}

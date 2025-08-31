import {
  HttpClient,
  HttpParams,
  httpResource,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WithdrawalService {
  url = 'http://localhost:3000/withdrawal/';
  constructor(private http: HttpClient) {}

  store(
    user_id: number,
    card_id: number,
    atm_id: number,
    amount: number,
    method: string,
    receipt: boolean
  ): Observable<HttpResponse<any>> {
    let data = { user_id, card_id, atm_id, amount, method, receipt };
    return this.http.post<any>(this.url + 'store', data, {
      observe: 'response',
    });
  }

  getUsed(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.url + `used/${id}`, {
      observe: 'response',
    });
  }

  getActive(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.url + 'active/' + `${id}`, {
      observe: 'response',
    });
  }

  getAll(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.url + 'all/' + `${id}`, {
      observe: 'response',
    });
  }
  removeWithdrawal(withdrawal_id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(this.url + 'destroy/' + `${withdrawal_id}`, {
      observe: 'response',
    });
  }
}

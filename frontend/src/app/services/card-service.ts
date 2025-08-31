import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Atm } from '../models/Atm';
import { Observable } from 'rxjs';
import { CardResponse } from '../models/CardResponse';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private url = 'http://localhost:3000/card';
  constructor(private http: HttpClient) {}

  storeCard(
    user_id: number,
    bank_id: number,
    card_number: string,
    card_type: string,
    expiration_date: Date,
    cvv: number
  ): Observable<HttpResponse<CardResponse>> {
    let data = {
      user_id,
      bank_id,
      card_number,
      card_type,
      expiration_date,
      cvv,
    };
    return this.http.post<CardResponse>(this.url + '/store', data, {
      observe: 'response',
    });
  }

  removeCard(
    card_id: number,
    user_id: number
  ): Observable<HttpResponse<CardResponse>> {
    let data = { card_id, user_id };
    return this.http.delete<CardResponse>(this.url + '/destroy', {
      body: data,
      observe: 'response',
    });
  }

  setMain(card_id: number, user_id: number): Observable<HttpResponse<any>> {
    let data = { card_id, user_id };
    return this.http.post<any>(this.url + `/set/main`, data, {
      observe: 'response',
    });
  }
}

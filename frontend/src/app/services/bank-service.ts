import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bank, BankResponse } from '../models/BankResponse';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  private url = 'http://localhost:3000/bank';
  constructor(private http: HttpClient) {}

  getBanks(): Observable<HttpResponse<BankResponse>> {
    return this.http.get<BankResponse>(this.url, { observe: 'response' });
  }
}

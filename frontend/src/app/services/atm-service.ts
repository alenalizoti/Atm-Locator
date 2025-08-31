import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Atm } from '../models/Atm';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AtmService {
  private url = 'http://localhost:3000/atm';
  constructor(private http: HttpClient) {}

  storeAtms(atms: Atm[]): Observable<HttpResponse<any>> {
    let data = { atms };
    return this.http.post<any>(this.url + '/store', data);
  }
  getAtms(
    count: number,
    bank: string,
    favouriteFilter: boolean,
    latitude: number,
    longitude: number
  ): Observable<HttpResponse<{ data: Atm[]; message: string }>> {
    let id = JSON.parse(localStorage.getItem('userInfo')).id;
    let data = {
      count,
      bank,
      isFavorite: favouriteFilter,
      latitude,
      longitude,
      user_id: id,
    };
    return this.http.post<{ data: Atm[]; message: string }>(
      this.url + '/get-atms',
      data,
      { observe: 'response' }
    );
  }
  addFavoriteAtm(
    user_id: number,
    atm_id: number
  ): Observable<HttpResponse<any>> {
    let data = { user_id, atm_id };
    return this.http.post(this.url + '/add-favorite', data, {
      observe: 'response',
    });
  }
  removeFavoriteAtm(
    user_id: number,
    atm_id: number
  ): Observable<HttpResponse<any>> {
    return this.http.delete<any>(this.url + '/remove-favorite', {
      body: { user_id, atm_id },
      observe: 'response',
    });
  }
  getAtm(atmId: number): Observable<HttpResponse<{ atm: Atm }>> {
    return this.http.get<{ atm: Atm }>(this.url + `/get-atm/${atmId}`, {
      observe: 'response',
    });
  }
}

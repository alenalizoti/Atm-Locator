import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/LoginResponse';
import { RegisterResponse } from '../models/RegisterResponse';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'userToken';
  private isBrowser: boolean;
  private url = 'http://localhost:3000/auth/';

  constructor(private http: HttpClient) {
    this.isBrowser =
      typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isGuest(): boolean {
    return !this.getToken();
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
      localStorage.removeItem('isLoggedIn');
    }
  }

  loginUser(
    email: String,
    password: String
  ): Observable<HttpResponse<LoginResponse>> {
    let data = { email: email, password: password };
    return this.http.post<LoginResponse>(this.url + 'login', data, {
      observe: 'response',
    });
  }

  registerUser(
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    avatar_url: string,
    gender: string
  ): Observable<HttpResponse<RegisterResponse>> {
    let data = { first_name, last_name, email, password, avatar_url, gender };
    return this.http.post<RegisterResponse>(this.url + 'register', data, {
      observe: 'response',
    });
  }
}

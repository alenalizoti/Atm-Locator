import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileDataResponse } from '../models/ProfileResponse';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}

  profile(user_id: number): Observable<HttpResponse<ProfileDataResponse>> {
    //let data = {user_id}
    return this.http.get<ProfileDataResponse>(
      this.url + `/profile/${user_id}`,
      { observe: 'response' }
    );
  }

  changeName(name: string, user_id: number): Observable<any> {
    let data = { fullName: name };
    return this.http.put<any>(this.url + '/update/' + `${user_id}`, data, {
      observe: 'response',
    });
  }

  changeEmail(email: string, user_id: number): Observable<any> {
    let data = { email: email };
    return this.http.put<any>(this.url + '/update/' + `${user_id}`, data, {
      observe: 'response',
    });
  }

  changeProfilePhoto(photoUrl: string, user_id: number): Observable<any> {
    let data = { photoUrl: photoUrl };
    return this.http.put<any>(this.url + '/update/' + `${user_id}`, data, {
      observe: 'response',
    });
  }

  getCards(user_id: number): Observable<any> {
    return this.http.get<any>(this.url + '/getCards/' + `${user_id}`, {
      observe: 'response',
    });
  }
}

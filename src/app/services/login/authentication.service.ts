import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.qa';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private _httpService: HttpService,
    private _localStorageService: LocalStorageService
  ) {}

  login(username: string, password: string): Observable<HttpResponse<any>> {
    const login = `${environment.apiEndPoint}users/login`;
    return this._httpService.request('post', login, { username, password });
  }

  register(userData: any): Observable<HttpResponse<any>> {
    const register = `${environment.apiEndPoint}users/register`;
    return this._httpService.request('post', register, { ...userData });
  }

  logout(): void {
    this._localStorageService.clearLocalStorage();
  }

  getUsers(): Observable<HttpResponse<any>> {
    const users = `${environment.apiEndPoint}users/`;
    return this._httpService.request('get', users);
  }
}

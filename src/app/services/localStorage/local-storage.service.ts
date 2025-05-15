import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import * as cryptoJs from 'crypto-js';

//custome imports for services,constants etc.
import { USER_ROLES } from '../../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  role = USER_ROLES.ADMIN;
  private username$ = new BehaviorSubject<any>({});
  selectedUsername$ = this.username$.asObservable();

  constructor(private router: Router) {}

  public isLoggedIn(): boolean {
    return !!this.getToken('token');
  }

  public setToken(key: string, token: string): void {
    token = cryptoJs.AES.encrypt(token, key).toString();
    localStorage.setItem(key, token);
  }

  public getToken(key: string): string | null {
    const token = localStorage.getItem(key);
    if (token) {
      try {
        console.log(cryptoJs.AES.decrypt(token, key).toString(cryptoJs.enc.Utf8));
        return cryptoJs.AES.decrypt(token, key).toString(cryptoJs.enc.Utf8);
      } catch (error) {
        console.log('getToken error',error)
        // this.clearLocalStorage();
        return null;
      }
    } else {
      return null;
    }
  }
 
  public setRole(role: string) {
    const r = cryptoJs.AES.encrypt(role, this.role).toString();
    localStorage.setItem('r', r);
  }

  public getRole(): string | null {
    const r = localStorage.getItem('r');
    if (r) {
      return cryptoJs.AES.decrypt(r, this.role).toString(cryptoJs.enc.Utf8);
    } else {
      return null;
    }
  }

  setLocalStorageItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getLocalStorageItem(key: string) {
    return localStorage.getItem(key);
  }

  deleteLocalStorageItem(key: string) {
    localStorage.removeItem(key);
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  isValidUser() {
    return (
      this.getRole() === this.role ||
      this.getRole() === USER_ROLES.USER ||
      this.getRole() === USER_ROLES.MANAGER
    );
  }

  setUsername(value: any) {
    this.username$.next(value);
  }
}

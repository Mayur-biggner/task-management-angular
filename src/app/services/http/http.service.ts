import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  request(method: string, url: string, body?: any, headers?: any,params?:any): Observable<any> {
    if ('get' === method || 'GET' === method) {
      return this.httpClient.request(method, url, { params });
    }
    return this.httpClient.request(method, url, { body, headers });
  }
}

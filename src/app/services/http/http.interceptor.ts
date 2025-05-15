import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { Router } from '@angular/router';

export const httpInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const _localStorage = inject(LocalStorageService);
  const token = _localStorage.getToken('token');
  console.log('token', token);
  let authReq = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err) {
        if (err.status === 401) {
          console.error('Unauthorized request:', err.error.message);
          inject(Router).navigate(['/login']);
        }
      }
      return throwError(() => err);
    })
  );
};

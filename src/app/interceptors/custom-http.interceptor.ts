import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { DataConstants } from '../constants/data-constants';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.injectToken(request)).pipe(
      filter(event => event instanceof HttpResponse,
      tap((event: HttpResponse<any>) => {
        const REFRESH_TOKEN = event.headers.get(DataConstants.REFRESH_TOKEN);
        if(REFRESH_TOKEN !== null && REFRESH_TOKEN !== undefined && REFRESH_TOKEN !== ''){
          localStorage.setItem(DataConstants.X_AUTH_TOKEN, REFRESH_TOKEN);
        }
      })
    ));
  }

  injectToken(request: HttpRequest<any>) {
    const AUTH_TOKEN = localStorage.getItem(DataConstants.X_AUTH_TOKEN);
    return request.clone({
      setHeaders: {
        'X-AUTH-TOKEN': `${AUTH_TOKEN}`
      }
    });
  }

}

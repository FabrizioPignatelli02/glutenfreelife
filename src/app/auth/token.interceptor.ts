import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, switchMap } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSrv: AuthService) {}

  newReq!: HttpRequest<any>;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authSrv.user$.pipe(
      take(1),
      switchMap((utente) => {
        if (!utente) {
          console.log(request);
          return next.handle(request);
        }

        this.newReq = request.clone({
          headers: request.headers.set(
            'Authorization',
            `Bearer ${utente.accessToken}`
          ),
        });

        return next.handle(this.newReq);
      })
    );
  }
}

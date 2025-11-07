import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../shared/loader.service';

@Injectable() // Make sure this is here
export class AuthInterceptor implements HttpInterceptor {

  private mockToken = 'Bearer MOCK_TOKEN_12345';

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();

    const authReq = req.clone({
      setHeaders: { Authorization: this.mockToken }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401: alert('Unauthorized'); break;
          case 404: alert('Not Found'); break;
          case 500: alert('Server Error'); break;
          default: alert(`Error: ${error.message}`);
        }
        return throwError(() => error);
      }),
      finalize(() => this.loaderService.hide())
    );
  }
}

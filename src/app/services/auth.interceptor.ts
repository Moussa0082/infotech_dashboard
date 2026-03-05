import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  // Dans AuthInterceptor.ts
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();
    console.log("Token envoyé :", accessToken);
    let authReq = req;

    // On n'ajoute pas le Bearer Token si c'est la requête de refresh (elle a déjà le sien)
    if (accessToken && !req.url.includes("/auth/refresh")) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes("/auth/refresh")) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = this.authService.getRefreshToken();
    if (refreshToken) {
      return this.authService.refreshTokens(refreshToken).pipe(
        switchMap((res) => {
          this.authService.updateAccessToken(res.token);
          return next.handle(
            request.clone({
              setHeaders: { Authorization: `Bearer ${res.token}` },
            })
          );
        }),
        catchError((err) => {
          this.authService.signOut(); // Échec définitif
          return throwError(() => err);
        })
      );
    }
    return throwError(() => new Error("No refresh token available"));
  }
}

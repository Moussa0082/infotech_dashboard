
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    // Ajoute le token si disponible
    let clonedReq = req;
    if (accessToken) {
      clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    // Gère les erreurs 401 (token expiré)
    return next.handle(clonedReq).pipe(
      // catchError((error: HttpErrorResponse) => {
      //   if (error.status === 401 && this.authService.getRefreshToken()) {
      //     // Si le token est expiré, on tente de le rafraîchir
      //     return this.authService.refreshTokens(this.authService.getRefreshToken()!).pipe(
      //       switchMap((res) => {
      //         // Sauvegarde le nouveau token
      //         this.authService.saveTokens({
      //           token: res.token,
      //           type: res.type,
      //           username: this.authService.currentUsername!,
      //           email: '', // Optionnel selon ton API
      //           refreshToken: this.authService.getRefreshToken()!
      //         });

      //         // Rejoue la requête initiale avec le nouveau token
      //         const newRequest = req.clone({
      //           setHeaders: { Authorization: `Bearer ${res.token}` }
      //         });
      //         return next.handle(newRequest);
      //       })
      //     );
      //   }

      //   // Si ce n’est pas une erreur de token, on la propage
      //   return throwError(() => error);
      // })
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authService.getRefreshToken()) {
          return this.authService.refreshTokens(this.authService.getRefreshToken()!).pipe(
            switchMap((res) => {
              this.authService.saveTokens({
                token: res.token,
                type: res.type,
                username: this.authService.currentUsername!,
                email: '',
                refreshToken: this.authService.getRefreshToken()!
              });
              const newRequest = req.clone({
                setHeaders: { Authorization: `Bearer ${res.token}` }
              });
              return next.handle(newRequest);
            }),
            catchError((err) => {
              // Refresh token invalide : logout
              this.authService.signOut();
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })      
    );
  }
}

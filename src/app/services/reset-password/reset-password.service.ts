import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  constructor(private http: HttpClient) { }

  sendResetEmail(recoveryEmail): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/api/reset-password`, recoveryEmail)
      .pipe(
        map(data => {
          return data.message;
        }),
        catchError(error => {
          return of (error);
        })
      );

  }

  sendResetTokenAndPassword(resetToken: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/save-password`, {token: resetToken, password})
      .pipe(
        map(data => {
          return data.message;
        }),
        catchError(error => {
          return of (error);
        })
      );
  }
}

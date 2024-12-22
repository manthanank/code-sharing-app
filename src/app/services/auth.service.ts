import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { SocketService } from './socket.service';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private token = new BehaviorSubject<string | null>(null);

  http = inject(HttpClient);
  socket = inject(SocketService);

  constructor() {}

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, { email, password }).pipe(
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response) => {
        sessionStorage.setItem('token', response.token);
        this.token.next(response.token);
      }),
      catchError(this.handleError)
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(password: string, resetToken: string, email: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/reset-password/${resetToken}/${email}`, { password }).pipe(
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.removeItem('token');
    this.token.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthState(): Observable<string | null> {
    return this.token.asObservable();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
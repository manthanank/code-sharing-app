import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/auth';
  private token = new BehaviorSubject<string | null>(null);

  http = inject(HttpClient);
  socket = inject(SocketService);

  constructor() {}

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        sessionStorage.setItem('token', response.token);
        this.token.next(response.token);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(
    password: string,
    resetToken: string,
    email: string
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/reset-password/${resetToken}/${email}`,
      {
        password,
      }
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
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';
import { Snippet } from '../models/snippet.model';

@Injectable({
  providedIn: 'root',
})
export class SnippetService {
  private apiUrl = `${environment.apiUrl}/snippets`;

  http = inject(HttpClient);

  constructor() {}

  addUpdateSnippet(
    snippet: Omit<Snippet, '_id' | 'createdAt' | 'updatedAt' | '__v'>
  ): Observable<Snippet> {
    return this.http
      .put<Snippet>(this.apiUrl, snippet)
      .pipe(catchError(this.handleError));
  }

  getSnippet(id: string): Observable<Snippet> {
    return this.http
      .get<Snippet>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteSnippet(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}

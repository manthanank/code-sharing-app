import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {

  private apiUrl = environment.apiUrl + '/snippets';

  constructor(private http: HttpClient) {}

  getSnippets(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createSnippet(snippet: any): Observable<any> {
    return this.http.post(this.apiUrl, snippet);
  }
}

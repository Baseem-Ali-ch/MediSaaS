// src/app/services/http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private handleError(err: any): Observable<never> {
    return throwError(() => err);
  }

  get<T>(url: string, params: Record<string, string> = {}): Observable<T> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => (httpParams = httpParams.set(k, v)));
    return this.http.get<T>(`${this.baseUrl}${url}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: unknown = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body)
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, body: unknown = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, body)
      .pipe(catchError(this.handleError));
  }

  patch<T>(url: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${url}`, body)
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`)
      .pipe(catchError(this.handleError));
  }
}
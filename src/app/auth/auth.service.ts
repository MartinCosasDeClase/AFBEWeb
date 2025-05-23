import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private readonly API_URL = environment.apiUrl;
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(this.API_URL+'/auth/login', { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.loggedIn.next(true);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    console.log(localStorage.getItem('token'))
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}

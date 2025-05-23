import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import {JwtInterceptor} from './auth/JwtInterceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  template: `
    <nav class="navbar">
      <div style="display: flex; align-items: center;">
        <img src="assets/afbeLogoInverted.png" alt="Logo FB" style="max-width: 50%; height: auto;"/>
        <span>AFBE</span>
      </div>
      <div>
        <a routerLink="/">Inicio</a>
        <a routerLink="/usuarios">Usuarios</a>
        <a routerLink="/actos">Actos</a>
        <button *ngIf="isLoggedIn" (click)="logout()" class="button">Cerrar sesión</button>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  title(title: any) {
      throw new Error('Method not implemented.');
  }
  isLoggedIn = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();

    this.auth.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
  }

  logout() {
    this.auth.logout();
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { JwtInterceptor } from './auth/JwtInterceptor';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  template: `
    <mat-toolbar class="navbar">
      <div class="logo-container">
        <img src="assets/afbeLogoInverted.png" alt="Logo FB" class="logo" />
        <span class="title">AFBE</span>
      </div>

      <div class="menu-container">
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>menu</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item routerLink="/">
            <mat-icon>home</mat-icon> Inicio
          </button>
          <button mat-menu-item routerLink="/usuarios">
            <mat-icon>group</mat-icon> Usuarios
          </button>
          <button mat-menu-item routerLink="/actos">
            <mat-icon>event</mat-icon> Actos
          </button>
          <button mat-menu-item routerLink="/partituras/nueva">
            <mat-icon>library_music</mat-icon> Partituras
            Partituras
          </button>
          <button mat-menu-item (click)="logout()" routerLink="/login" style="color: red">
            <mat-icon style="color: red">logout</mat-icon> Cerrar sesión
          </button>


        </mat-menu>
      </div>
    </mat-toolbar>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      background-color: #a21616;
      color: white;
    }

    .logo-container {
      display: flex;
      align-items: center;
    }

    .logo {
      max-width: 70px;
      height: auto;
      margin-right: 10px;
    }

    .title {
      font-size: 1.7rem;
      font-weight: bold;
    }

    .menu-container {
      display: flex;
      align-items: center;
    }

    .menu-container button {
      color: white;
    }

    mat-menu {
      background-color: white;
    }

    mat-menu-item mat-icon {
      margin-right: 10px;
    }
  `]
})
export class AppComponent implements OnInit {
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

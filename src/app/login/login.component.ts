import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <mat-card class="login-container">
      <h2>Iniciar sesión</h2>
      <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="login-form">
        <mat-form-field appearance="fill">
          <mat-label>Correo electrónico</mat-label>
          <input matInput type="email" [(ngModel)]="email" name="email" required />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" [(ngModel)]="password" name="password" required />
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">
          Entrar
        </button>
      </form>

      <p *ngIf="error" class="error-message">{{ error }}</p>
    </mat-card>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 5rem auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }

    .error-message {
      color: #ff4b2b;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.error = 'Acceso denegado.';
        }
      },
      error: (err) => {
        this.error = err.error || 'Error desconocido en el login.';
      }
    });
  }
}

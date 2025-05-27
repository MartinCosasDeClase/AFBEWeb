import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="blur-bg" style="max-width: 400px; margin: 5rem auto;">
      <h2>Iniciar sesión</h2>
      <form (ngSubmit)="onLogin()" #loginForm="ngForm">
        <input
          type="text"
          placeholder="Correo electrónico"
          [(ngModel)]="email"
          name="email"
          required
          #emailInput="ngModel"
        />
        <input
          type="password"
          placeholder="Contraseña"
          [(ngModel)]="password"
          name="password"
          required
          #passwordInput="ngModel"
        />
        <button class="button" type="submit" [disabled]="loginForm.invalid">Entrar</button>
      </form>
      <p *ngIf="error" style="color: #ff4b2b; margin-top: 1rem;">{{ error }}</p>
    </div>
  `
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

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-usuario-nuevo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="form-container">
      <h2>Nuevo Usuario</h2>
      <form (ngSubmit)="onSubmit()" #userForm="ngForm" class="user-form" novalidate>

        <div class="form-grid">
          <mat-form-field>
            <mat-label>NIF</mat-label>
            <input matInput name="nif" [(ngModel)]="user.nif" required minlength="9" maxlength="9" placeholder="12345678a" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Nombre</mat-label>
            <input matInput name="name" [(ngModel)]="user.name" required placeholder="Nombre" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Apellidos</mat-label>
            <input matInput name="surnames" [(ngModel)]="user.surnames" required placeholder="Apellidos" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput type="email" name="email" [(ngModel)]="user.email" required placeholder="email@ejemplo.com" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" name="password" [(ngModel)]="user.password" required minlength="6" placeholder="******" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Edad</mat-label>
            <input matInput type="number" name="age" [(ngModel)]="user.age" min="0" max="120" required placeholder="Edad" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Género</mat-label>
            <mat-select name="gender" [(ngModel)]="user.gender" required>
              <mat-option value="Masculino">Masculino</mat-option>
              <mat-option value="Femenino">Femenino</mat-option>
              <mat-option value="Otro">Otro</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Teléfono</mat-label>
            <input matInput type="tel" name="telephone" [(ngModel)]="user.telephone" pattern="[0-9]{9}" required placeholder="123456789" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Instrumento</mat-label>
            <mat-select name="instrumento" [(ngModel)]="user.instrumentoId" required>
              <mat-option *ngFor="let instrumento of instrumentos" [value]="instrumento.id">
                {{ instrumento.nombre }} ({{ instrumento.categoria }})
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Rol</mat-label>
            <mat-select name="rol" [(ngModel)]="user.rol" required>
              <mat-option value="user">User</mat-option>
              <mat-option value="admin">Admin</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button mat-raised-button color="warn" type="button" (click)="cancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">Guardar</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
  `]
})
export class UsuarioNuevoComponent implements OnInit {
  user = {
    nif: '',
    name: '',
    surnames: '',
    email: '',
    password: '',
    age: null,
    gender: '',
    telephone: '',
    instrumentoId: '',
    rol: ''
  };

  instrumentos: any[] = [];
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>(this.API_URL + '/api/instrumentos').subscribe(data => {
      this.instrumentos = data;
    });
  }

  onSubmit() {
    const usuario = {
      ...this.user,
      instrumento: { id: this.user.instrumentoId }
    };

    this.http.post(this.API_URL + '/api/register', usuario, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => {
        alert('Usuario creado con éxito');
        this.router.navigate(['/usuarios']);
      },
      error: () => alert('Error al añadir usuario')
    });
  }

  cancel() {
    this.router.navigate(['/usuarios']);
  }
}

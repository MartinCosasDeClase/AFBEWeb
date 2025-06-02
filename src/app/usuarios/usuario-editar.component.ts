import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../environment/environment';

export interface Instrumento {
  id: string;
  nombre: string;
  categoria: string;
}

export interface User {
  nif: string;
  name: string;
  surnames?: string;
  email: string;
  telephone: string;
  age: number;
  gender: string;
  instrumento?: { id: string; nombre?: string };
  rol: string;
  password: string;
}

@Component({
  selector: 'app-usuario-editar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <mat-card class="usuario-editar-container">
      <h2>Editar Usuario</h2>

      <form (ngSubmit)="guardarCambios()" #editForm="ngForm" class="form-grid">

      <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="user.name" name="name" required />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Apellidos</mat-label>
          <input matInput [(ngModel)]="user.surnames" name="surnames" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="user.email" name="email" required />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Teléfono</mat-label>
          <input matInput type="tel" [(ngModel)]="user.telephone" name="telephone" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Edad</mat-label>
          <input matInput type="number" [(ngModel)]="user.age" name="age" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Género</mat-label>
          <input matInput [(ngModel)]="user.gender" name="gender" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Instrumento</mat-label>
          <mat-select [(ngModel)]="instrumentoSeleccionadoId" name="instrumento">
            <mat-option *ngFor="let instrumento of instrumentos" [value]="instrumento.id">
              {{ instrumento.nombre }} ({{ instrumento.categoria }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Rol</mat-label>
          <mat-select [(ngModel)]="user.rol" name="rol" required>
            <mat-option value="user">User</mat-option>
            <mat-option value="admin">Admin</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-stroked-button color="accent" type="button" (click)="toggleCampoPassword()">
          {{ mostrarCampoPassword ? 'Cancelar cambio de contraseña' : 'Restablecer contraseña' }}
        </button>

        <div *ngIf="mostrarCampoPassword">
          <mat-form-field>
            <mat-label>Nueva contraseña</mat-label>
            <input matInput [(ngModel)]="nuevaPassword" name="password" type="password" />
          </mat-form-field>
        </div>

        <div class="button-container">
          <button mat-raised-button color="warn" type="button" (click)="volver()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="editForm.invalid">
            Guardar cambios
          </button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [`
    .usuario-editar-container {
      max-width: 800px;
      margin: auto;
      padding: 20px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.9);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    .button-container {
      grid-column: span 2;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    button[mat-stroked-button] {
      grid-column: span 2;
    }

  `]
})
export class UsuarioEditarComponent implements OnInit {
  user: User = {
    nif: '',
    name: '',
    surnames: '',
    email: '',
    telephone: '',
    age: 0,
    gender: '',
    instrumento: { id: '' },
    rol: '',
    password: ''
  };

  instrumentos: Instrumento[] = [];
  instrumentoSeleccionadoId = '';
  mostrarCampoPassword = false;
  nuevaPassword = '';

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.http.get<Instrumento[]>(`${this.API_URL}/api/instrumentos`).subscribe(data => {
      this.instrumentos = data;
    });

    this.route.params.subscribe(params => {
      const userNif = params['nif'];
      this.http.get<User>(`${this.API_URL}/api/users/${userNif}`).subscribe(user => {
        this.user = user;
        this.instrumentoSeleccionadoId = user.instrumento?.id || '';
      });
    });
  }

  guardarCambios(): void {
    const usuarioActualizado: any = {
      ...this.user,
      instrumento: this.instrumentoSeleccionadoId ? { id: this.instrumentoSeleccionadoId } : null
    };

    if (this.mostrarCampoPassword && this.nuevaPassword.trim()) {
      usuarioActualizado.password = this.nuevaPassword.trim();
    }

    this.http.put(`${this.API_URL}/api/users/${this.user.nif}`, usuarioActualizado).subscribe({
      next: () => {
        alert('Usuario actualizado con éxito');
        this.router.navigate(['/usuarios']);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/usuarios']);
  }

  toggleCampoPassword(): void {
    this.mostrarCampoPassword = !this.mostrarCampoPassword;
    if (!this.mostrarCampoPassword) {
      this.nuevaPassword = '';
    }
  }
}

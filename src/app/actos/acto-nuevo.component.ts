import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-acto-nuevo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="form-container">
      <h2>Nuevo Acto</h2>
      <form (ngSubmit)="onSubmit()" #actForm="ngForm" class="act-form" novalidate>
        <div class="form-grid">
          <mat-form-field>
            <mat-label>Nombre del Acto</mat-label>
            <input matInput name="nombre" [(ngModel)]="acto.nombre" required placeholder="Nombre del acto" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Ubicación</mat-label>
            <input matInput name="ubicacion" [(ngModel)]="acto.ubicacion" required placeholder="Ubicación" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Fecha y Hora</mat-label>
            <input matInput name="fechaHora" [(ngModel)]="acto.fechaHora" required placeholder="AAAA-MM-DD hh:mm:ss" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Descripción</mat-label>
            <textarea matInput name="descripcion" [(ngModel)]="acto.descripcion" required
                      placeholder="Descripción del acto"></textarea>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Partituras</mat-label>
            <input matInput name="partituras" [(ngModel)]="acto.partituras" placeholder="Partituras" />
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button mat-raised-button color="warn" type="button" (click)="cancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="actForm.invalid">Guardar</button>
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
export class ActoNuevoComponent implements OnInit {
  acto = {
    nombre: '',
    ubicacion: '',
    fechaHora: '',
    descripcion: '',
    partituras: ''
  };

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit(): void {
    this.http.post(this.API_URL + '/api/newActo', this.acto, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => {
        alert('Acto creado con éxito');
        this.router.navigate(['/actos']);
      },
      error: () => {
        alert('Error al añadir el acto');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/actos']);
  }
}

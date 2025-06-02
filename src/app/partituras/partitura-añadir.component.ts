import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartituraService, Instrumento } from './PartituraService';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {
  MatInputModule
} from '@angular/material/input';
import {
  MatSelectModule
} from '@angular/material/select';
import {
  MatButtonModule
} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-partitura-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule
  ],
  template: `
    <div class="form-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" enctype="multipart/form-data">
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Instrumento</mat-label>
          <mat-select formControlName="instrumento" required>
            <mat-option *ngFor="let instrumento of instrumentos" [value]="instrumento.id">
              {{ instrumento.nombre }}{{instrumento.categoria}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Obra</mat-label>
          <input matInput formControlName="obra" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Autor</mat-label>
          <input matInput formControlName="autor" required />
        </mat-form-field>

        <div class="form-field">
          <label for="fileInput">Imagen</label>
          <input id="fileInput" type="file" (change)="onFileSelected($event)" required />
        </div>

        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || !imagenSeleccionada">
          Crear Partitura
        </button>

        <p class="success" *ngIf="successMessage">{{ successMessage }}</p>
        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 500px;
      margin: 40px auto;
      padding: 24px;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-field {
      width: 100%;
    }

    button {
      align-self: flex-end;
    }

    .success {
      color: #4caf50;
      margin-top: 10px;
      font-weight: 500;
    }

    .error {
      color: #f44336;
      margin-top: 10px;
      font-weight: 500;
    }
  `]
})
export class PartituraFormComponent implements OnInit {
  form: FormGroup;
  imagenSeleccionada: File | null = null;
  instrumentos: Instrumento[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private partituraService: PartituraService
  ) {
    this.form = this.fb.group({
      instrumento: ['', Validators.required],
      obra: ['', Validators.required],
      autor: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.partituraService.getInstrumentos().subscribe({
      next: (data) => this.instrumentos = data,
      error: () => this.errorMessage = 'Error al cargar instrumentos.'
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.imagenSeleccionada = fileInput.files[0];
    }
  }

  onSubmit() {
    if (this.form.valid && this.imagenSeleccionada) {
      this.partituraService.uploadPartituraWithImage(this.form.value, this.imagenSeleccionada).subscribe({
        next: () => {
          this.successMessage = 'Partitura creada correctamente.';
          this.errorMessage = '';
          this.form.reset();
          this.imagenSeleccionada = null;
        },
        error: () => {
          this.errorMessage = '';
          this.successMessage = '';
        }
      });
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PublicacionService } from './publicacion.service';

@Component({
  selector: 'app-publicacion-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="form-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" enctype="multipart/form-data">
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Descripción</mat-label>
          <input matInput formControlName="descripcion" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Usuario</mat-label>
          <input matInput formControlName="usuario" required />
        </mat-form-field>

        <div class="form-field">
          <label for="fileInput">Imagen</label>
          <input id="fileInput" type="file" (change)="onFileSelected($event)" required />
        </div>

        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || !imagenSeleccionada">
          Crear Publicación
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
export class PublicacionFormComponent {
  form: FormGroup;
  imagenSeleccionada: File | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private publicacionService: PublicacionService
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      usuario: ['', Validators.required]
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
      this.publicacionService.subirPublicacion(this.form.value, this.imagenSeleccionada).subscribe({
        next: () => {
          this.successMessage = 'Publicación creada correctamente.';
          this.errorMessage = '';
          this.form.reset();
          this.imagenSeleccionada = null;
        },
        error: () => {
          this.errorMessage = 'Error al crear la publicación.';
          this.successMessage = '';
        }
      });
    }
  }
}

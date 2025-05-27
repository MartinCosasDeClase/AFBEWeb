import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environment/environment';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

export interface Acto {
  id: number;
  nombre: string;
  ubicacion: string;
  fechaHora: string;
  descripcion: string;
  partituras: string;
}

@Component({
  selector: 'app-actos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  template: `
    <mat-card class="actos-container">
      <h2>Actos</h2>

      <mat-form-field appearance="fill" class="search-field">
        <mat-label>Buscar por cualquier campo</mat-label>
        <input matInput [(ngModel)]="filtro" (input)="applyFilter($event)" placeholder="Buscar..." />
      </mat-form-field>

      <div class="table-container">
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

          <!-- Columna ID -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> ID </th>
            <td mat-cell *matCellDef="let acto"> {{ acto.id }} </td>
          </ng-container>

          <!-- Columna Nombre -->
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef> Nombre </th>
            <td mat-cell *matCellDef="let acto"> {{ acto.nombre }} </td>
          </ng-container>

          <!-- Columna Ubicación -->
          <ng-container matColumnDef="ubicacion">
            <th mat-header-cell *matHeaderCellDef> Ubicación </th>
            <td mat-cell *matCellDef="let acto"> {{ acto.ubicacion }} </td>
          </ng-container>

          <!-- Columna Fecha y Hora -->
          <ng-container matColumnDef="fechaHora">
            <th mat-header-cell *matHeaderCellDef> Fecha y Hora </th>
            <td mat-cell *matCellDef="let acto"> {{ acto.fechaHora }} </td>
          </ng-container>

          <!-- Columna Descripción -->
          <ng-container matColumnDef="descripcion">
            <th mat-header-cell *matHeaderCellDef> Descripción </th>
            <td mat-cell *matCellDef="let acto"> {{ acto.descripcion }} </td>
          </ng-container>

          <!-- Columna Partituras -->
          <ng-container matColumnDef="partituras">
            <th mat-header-cell *matHeaderCellDef> Partituras </th>
            <td mat-cell *matCellDef="let acto"> {{ acto.partituras }} </td>
          </ng-container>


          <ng-container matColumnDef="asistencia">
            <th mat-header-cell *matHeaderCellDef> Asistencia </th>
            <td mat-cell *matCellDef="let acto">
              <button mat-raised-button color="accent" (click)="verAsistencia(acto.id)">
                Ver Asistencia
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <mat-paginator [pageSize]="10"></mat-paginator>

      <div class="button-container">
        <button mat-raised-button color="primary" (click)="nuevoActo()">＋ Crear acto</button>
      </div>
    </mat-card>
  `,
  styles: [`
    .actos-container {
      max-width: 1000px;
      margin: 20px auto;
      padding: 20px;
    }
    .search-field {
      width: 100%;
      margin-bottom: 16px;
    }
    .table-container {
      overflow-x: auto;
      overflow-y: auto;
      max-height: 450px;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      min-width: 800px;
    }
    mat-header-cell {
      font-weight: bold;
    }
    .button-container {
      margin-top: 16px;
      text-align: center;
    }
  `]
})
export class ActosComponent implements OnInit {
  actos: Acto[] = [];
  filtro: string = '';
  displayedColumns: string[] = ['id', 'nombre', 'ubicacion', 'fechaHora', 'descripcion', 'partituras', 'asistencia'];
  dataSource = new MatTableDataSource<Acto>([]);

  private readonly API_URL = environment.apiUrl;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<Acto[]>(this.API_URL + '/api/actos', {
      headers: { 'Accept': 'application/json' }
    }).subscribe(data => {
      this.actos = data;
      this.dataSource.data = this.actos;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  nuevoActo() {
    this.router.navigate(['/actos/nuevo']);
  }

  verAsistencia(actoId: number): void {
    this.router.navigate(['/actos', actoId, 'asistencia']);
  }
}

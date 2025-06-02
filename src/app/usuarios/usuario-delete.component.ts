import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../environment/environment';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface Usuario {
  name: string;
  surnames: string;
  nif: string;
}

@Component({
  selector: 'app-usuario-eliminar',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule
  ],
  template: `
    <mat-card class="delete-container">
      <h2>Eliminar Usuario</h2>

      <mat-form-field appearance="fill">
        <mat-label>Buscar usuario por nombre</mat-label>
        <input matInput [(ngModel)]="filtro" (input)="applyFilter($event)" placeholder="Busca por nombre..." />
      </mat-form-field>

      <div class="table-container">
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Nombre y Apellidos </th>
            <td mat-cell *matCellDef="let user">
              {{ user.name }} {{ user.surnames }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              (click)="selectUser(row)"
              [ngClass]="{'selected': seleccionado?.nif === row.nif}">
          </tr>
        </table>
      </div>

      <mat-paginator [pageSize]="10"></mat-paginator>

      <div class="actions">
        <button mat-raised-button color="warn" (click)="eliminarUsuario()"
                [disabled]="!seleccionado">
          Eliminar
        </button>
        <button mat-raised-button (click)="router.navigate(['/usuarios'])" color="primary">
          Volver
        </button>
      </div>
    </mat-card>
  `,
  styles: [`
    .delete-container {
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
    }

    .table-container {
      overflow: auto;
      max-height: 400px;
      margin-bottom: 2px;
    }

    table {
      width: 100%;
    }

    .selected {
      background-color: #a21616 !important;
      color: white !important;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class UsuarioEliminarComponent implements OnInit {
  usuarios: Usuario[] = [];
  seleccionado: Usuario | null = null;
  filtro: string = "";
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<Usuario>([]);

  private readonly API_URL = environment.apiUrl;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.http.get<Usuario[]>(this.API_URL + '/api/users').subscribe(data => {
      this.usuarios = data;
      this.dataSource.data = this.usuarios;
      this.dataSource.paginator = this.paginator;
    });
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectUser(user: Usuario): void {
    this.seleccionado = this.seleccionado && this.seleccionado.nif === user.nif ? null : user;
  }

  eliminarUsuario(): void {
    if (this.seleccionado) {
      const confirmacion = confirm(`¿Seguro que quieres eliminar a ${this.seleccionado.name} ${this.seleccionado.surnames}?`);
      if (confirmacion) {
        this.http.delete(this.API_URL + '/api/deleteUser/' + this.seleccionado.nif).subscribe({
          next: () => {
            alert('Usuario eliminado');
            this.usuarios = this.usuarios.filter(u => u.nif !== this.seleccionado!.nif);
            this.dataSource.data = this.usuarios;
            this.seleccionado = null;
          },
          error: () => {
            alert('Error al eliminar');
          }
        });
      }
    }
  }
}

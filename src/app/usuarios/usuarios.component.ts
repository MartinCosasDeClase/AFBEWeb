import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="usuarios-container">
      <h2>Usuarios</h2>

      <mat-form-field class="search-bar">
        <mat-label>Buscar usuarios</mat-label>
        <input matInput [(ngModel)]="filtro" placeholder="Buscar usuarios" (input)="filtrarUsuarios()" />
      </mat-form-field>

      <div class="table-container">
        <table mat-table [dataSource]="dataSource" class="usuarios-table">
          <ng-container matColumnDef="nif">
            <th mat-header-cell *matHeaderCellDef> NIF </th>
            <td mat-cell *matCellDef="let user"> {{ user.nif }} </td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Nombre </th>
            <td mat-cell *matCellDef="let user"> {{ user.name }} </td>
          </ng-container>
          <ng-container matColumnDef="surnames">
            <th mat-header-cell *matHeaderCellDef> Apellidos </th>
            <td mat-cell *matCellDef="let user"> {{ user.surnames }} </td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef> Email </th>
            <td mat-cell *matCellDef="let user"> {{ user.email }} </td>
          </ng-container>
          <ng-container matColumnDef="telephone">
            <th mat-header-cell *matHeaderCellDef> Teléfono </th>
            <td mat-cell *matCellDef="let user"> {{ user.telephone }} </td>
          </ng-container>
          <ng-container matColumnDef="age">
            <th mat-header-cell *matHeaderCellDef> Edad </th>
            <td mat-cell *matCellDef="let user"> {{ user.age }} </td>
          </ng-container>
          <ng-container matColumnDef="gender">
            <th mat-header-cell *matHeaderCellDef> Género </th>
            <td mat-cell *matCellDef="let user"> {{ user.gender }} </td>
          </ng-container>
          <ng-container matColumnDef="instrumento">
            <th mat-header-cell *matHeaderCellDef> Instrumento </th>
            <td mat-cell *matCellDef="let user"> {{ user.instrumento?.nombre }} </td>
          </ng-container>
          <ng-container matColumnDef="rol">
            <th mat-header-cell *matHeaderCellDef> Rol </th>
            <td mat-cell *matCellDef="let user"> {{ user.rol }} </td>
          </ng-container>
          <ng-container matColumnDef="password">
            <th mat-header-cell *matHeaderCellDef> Contraseña </th>
            <td mat-cell *matCellDef="let user"> {{ user.password }} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [pageSize]="10"></mat-paginator>
      </div>

      <div class="button-container">
        <button mat-raised-button color="warn" (click)="goToDelete()">- Eliminar Usuario</button>
        <button mat-raised-button color="primary" (click)="nuevoUsuario()">＋ Añadir usuario</button>
      </div>
    </mat-card>
  `,
  styles: [`
    .usuarios-container {
      padding: 20px;
      margin: auto;
      max-width: 1200px;
    }

    .usuarios-table {
      width: 100%;
    }

    .table-container {
      max-height: 500px;
      overflow-y: auto;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
    }

    .search-bar {
      width: 100%;
      margin-bottom: 20px;
    }

    .button-container {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
  `]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  filtro: string = '';
  displayedColumns: string[] = ['nif', 'name', 'surnames', 'email', 'telephone', 'age', 'gender', 'instrumento', 'rol', 'password'];
  dataSource = new MatTableDataSource<any>([]);

  private readonly API_URL = environment.apiUrl;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>(this.API_URL + '/api/users', {
      headers: { 'Accept': 'application/json' }
    }).subscribe(data => {
      this.usuarios = data;
      this.dataSource.data = this.usuarios;
      this.dataSource.paginator = this.paginator;
    });
  }

  filtrarUsuarios(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  nuevoUsuario() {
    this.router.navigate(['/usuarios/nuevo']);
  }

  goToDelete() {
    this.router.navigate(['/usuarios/eliminar']);
  }
}

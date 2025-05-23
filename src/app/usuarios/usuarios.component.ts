import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterUserPipe } from './filter-user.pipe';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterUserPipe],
  template: `
    <div class="blur-bg">
      <h2>Usuarios</h2>
      <input type="text" [(ngModel)]="filtro" placeholder="Buscar por cualquier campo" />
      <table class="usuarios-table">
        <thead>
        <tr>
          <th>NIF</th>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Edad</th>
          <th>Género</th>
          <th>Instrumento</th>
          <th>Rol</th>
          <th>Contraseña</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let user of usuarios | filterUser:filtro">
          <td>{{ user.NIF }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.surnames }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.telephone }}</td>
          <td>{{ user.age }}</td>
          <td>{{ user.gender }}</td>
          <td>{{ user.instrumento?.nombre }}</td>
          <td>{{ user.rol }}</td>
          <td>{{ user.password }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .usuarios-table {
      width: 100%;
      border-collapse: collapse;
    }
    .usuarios-table th, .usuarios-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .usuarios-table th {
      background-color: #f4f4f4;
    }
    input {
      margin-bottom: 10px;
      padding: 5px;
      width: 100%;
    }
  `]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  filtro: string = '';

  constructor(private http: HttpClient) {}

  private readonly API_URL = environment.apiUrl;

  ngOnInit(): void {
    this.http.get<any[]>(this.API_URL + '/api/users', {
      headers: { 'Accept': 'application/json' }
    }).subscribe(data => this.usuarios = data);
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterActoPipe } from './filter-acto.pipe';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-actos',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterActoPipe],
  template: `
    <div class="blur-bg">
      <h2>Actos</h2>
      <input type="text" [(ngModel)]="filtro" placeholder="Buscar por cualquier campo" />
      <table class="actos-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Ubicación</th>
          <th>Fecha y Hora</th>
          <th>Descripción</th>
          <th>Partituras</th>
          <th>Asistencia</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let acto of actos | filterActo:filtro">
          <td>{{ acto.id }}</td>
          <td>{{ acto.nombre }}</td>
          <td>{{ acto.ubicacion }}</td>
          <td>{{ acto.fechaHora }}</td>
          <td>{{ acto.descripcion }}</td>
          <td>{{ acto.partituras }}</td>
          <td>{{ acto.asistencia ? 'Sí' : 'No' }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .actos-table {
      width: 100%;
      border-collapse: collapse;
    }
    .actos-table th, .actos-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .actos-table th {
      background-color: #f4f4f4;
    }
    input {
      margin-bottom: 10px;
      padding: 5px;
      width: 100%;
    }
  `]
})
export class ActosComponent implements OnInit {
  actos: any[] = [];
  filtro: string = '';

  constructor(private http: HttpClient) {}

  private readonly API_URL = environment.apiUrl;

  ngOnInit(): void {
    this.http.get<any[]>(this.API_URL + '/api/actos', {
      headers: { 'Accept': 'application/json' }
    }).subscribe(data => this.actos = data);
  }
}

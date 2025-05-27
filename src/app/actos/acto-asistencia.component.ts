import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../environment/environment';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';

export interface User {
  id: number;
  name: string;
  surnames?: string;
  instrumento: {
    id: number;
    nombre: string;
    categoria: string;
  };
}

@Component({
  selector: 'app-acto-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton
  ],
  template: `
    <mat-card class="asistencia-container">
      <h2 class="card-title">Asistencia Confirmada para el Acto {{ actoId }}</h2>

      <!-- Sección para agrupar los usuarios por instrumento y subdividir por categoría -->
      <div class="group-grid" *ngIf="groupedByInstrument?.length">
        <div *ngFor="let group of groupedByInstrument" class="group-box">
          <h3 class="group-header">{{ group.instrument }}</h3>
          <div *ngFor="let sub of group.subGroups" class="subgroup">
            <h4 class="subgroup-header">{{ group.instrument }} {{ sub.category }}</h4>
            <ul class="user-list">
              <li *ngFor="let user of sub.users">
                {{ user.name }} {{ user.surnames }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="button-container">
        <button mat-raised-button color="primary" (click)="goBack()" class="custom-button">
          Volver a Actos
        </button>
      </div>
    </mat-card>
  `,
  styles: [`
    /* No modificamos el fondo del contenedor, solo el fondo del body se cambiará vía código */
    .asistencia-container {
      max-width: 1500px;
      margin: 30px auto;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
      background: #fafafa;
    }
    .card-title {
      text-align: center;
      margin-bottom: 20px;
      font-weight: 600;
      color: #961a1a;
    }
    table {
      width: 100%;
      min-width: 600px;
    }
    mat-header-cell {
      font-weight: bold;
      background-color: #e8eaf6;
      color: #303f9f;
      padding: 8px;
      border-bottom: 2px solid #c5cae9;
    }
    mat-cell {
      padding: 8px;
    }
    .table-row:hover {
      background-color: #f5f5f5;
      transition: background-color 0.3s ease;
    }
    /* Sección para agrupación por instrumento con subcategorías */
    .group-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    .group-box {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      padding: 10px;
      box-shadow: 0px 1px 4px rgba(0,0,0,0.1);
    }
    .group-header {
      font-size: 1.2em;
      color: #3f51b5;
      margin-bottom: 10px;
      text-align: center;
    }
    .subgroup {
      margin-bottom: 10px;
      border-top: 1px solid #e0e0e0;
      padding-top: 5px;
    }
    .subgroup-header {
      font-size: 1.1em;
      color: #3f51b5;
      margin-bottom: 5px;
      text-align: center;
    }
    .user-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .user-list li {
      padding: 4px 0;
      border-bottom: 1px dotted #ccc;
    }
    .user-list li:last-child {
      border-bottom: none;
    }
    .button-container {
      margin-top: 16px;
      text-align: center;
    }
  `]
})
export class ActoAsistenciaComponent implements OnInit, OnDestroy {
  actoId!: number;
  usuarios: User[] = [];
  displayedColumns: string[] = ['nombre', 'instrumento'];
  dataSource = new MatTableDataSource<User>([]);

  groupedByInstrument: {
    instrument: string;
    subGroups: { category: string; users: User[] }[]
  }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private readonly API_URL = environment.apiUrl;
  private originalBodyBackgroundImage = document.body.style.backgroundImage;
  private originalBodyBackgroundColor = document.body.style.backgroundColor;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#b6b6b6';

    this.actoId = Number(this.route.snapshot.paramMap.get('actoId'));
    this.http.get<User[]>(`${this.API_URL}/api/actos/${this.actoId}/asistencia/confirmados`, {
      headers: { 'Accept': 'application/json' }
    }).subscribe(data => {
      this.usuarios = data;
      this.dataSource.data = this.usuarios;
      this.dataSource.paginator = this.paginator;
      this.groupUsersByInstrumentAndCategory();
    });
  }

  ngOnDestroy(): void {
    // Restauramos el background original al abandonar esta pestaña (opcional)
    document.body.style.backgroundImage = this.originalBodyBackgroundImage;
    document.body.style.backgroundColor = this.originalBodyBackgroundColor;
  }

  groupUsersByInstrumentAndCategory(): void {
    const groups = new Map<string, Map<string, User[]>>();
    for (const user of this.usuarios) {
      const inst = user.instrumento;
      const instrumentName = inst?.nombre || 'Sin instrumento';
      const category = inst?.categoria || 'Sin categoría';

      if (!groups.has(instrumentName)) {
        groups.set(instrumentName, new Map<string, User[]>());
      }
      const subGroup = groups.get(instrumentName)!;
      if (!subGroup.has(category)) {
        subGroup.set(category, []);
      }
      subGroup.get(category)!.push(user);
    }

    this.groupedByInstrument = Array.from(groups.entries())
      .map(([instrument, subGroup]) => ({
        instrument,
        subGroups: Array.from(subGroup.entries())
          .map(([category, users]) => ({ category, users }))
          .sort((a, b) => a.category.localeCompare(b.category))
      }))
      .sort((a, b) => a.instrument.localeCompare(b.instrument));
  }

  goBack(): void {
    this.router.navigate(['/actos']);
  }
}

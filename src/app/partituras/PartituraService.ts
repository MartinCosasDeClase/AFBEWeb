import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../environment/environment';

export interface Instrumento {
  id: number;
  nombre: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartituraService {
  constructor(private http: HttpClient) {}
 URL = environment.apiUrl;
  getInstrumentos(): Observable<Instrumento[]> {
    return this.http.get<Instrumento[]>(environment.apiUrl+'/api/instrumentos');
  }

  uploadPartituraWithImage(formData: any, imagen: File): Observable<any> {
    const data = new FormData();
    data.append('instrumentoId', formData.instrumento);
    data.append('obra', formData.obra);
    data.append('autor', formData.autor);
    data.append('imagen', imagen);
    return this.http.post(environment.apiUrl+'/api/partituras/new', data);
  }
}

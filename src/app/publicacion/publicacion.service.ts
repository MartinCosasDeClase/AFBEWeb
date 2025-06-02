import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = 'http://localhost:8080/api/publicaciones/new';

  constructor(private http: HttpClient) {}

  subirPublicacion(data: any, imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descripcion', data.descripcion);
    formData.append('usuario', data.usuario);
    formData.append('imagen', imagen);

    return this.http.post(this.apiUrl, formData);
  }
}

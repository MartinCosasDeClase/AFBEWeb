import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterActo',
  standalone: true
})
export class FilterActoPipe implements PipeTransform {
  transform(actos: any[], filtro: string): any[] {
    if (!actos) return [];
    if (!filtro) return actos;
    filtro = filtro.toLowerCase();
    return actos.filter(
      acto =>
        acto.nombre.toLowerCase().includes(filtro) ||
        acto.id?.toString().toLowerCase().includes(filtro)
    );
  }
}

export class FilterUserPipe {
}

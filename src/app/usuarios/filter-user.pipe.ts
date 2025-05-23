import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUser',
  standalone: true
})
export class FilterUserPipe implements PipeTransform {
  transform(users: any[], filtro: string): any[] {
    if (!users || !Array.isArray(users)) return [];
    if (!filtro) return users;

    filtro = filtro.toLowerCase();

    return users.filter(user => {
      return (
        (user.name && user.name.toLowerCase().includes(filtro)) ||
        (user.surnames && user.surnames.toLowerCase().includes(filtro)) ||
        (user.NIF && user.NIF.toLowerCase().includes(filtro)) ||
        (user.email && user.email.toLowerCase().includes(filtro)) ||
        (user.telephone && user.telephone.toString().includes(filtro)) ||
        (user.age && user.age.toString().includes(filtro)) ||
        (user.gender && user.gender.toLowerCase().includes(filtro)) ||
        (user.instrumento?.nombre && user.instrumento.nombre.toLowerCase().includes(filtro)) ||
        (user.rol && user.rol.toLowerCase().includes(filtro))
      );
    });
  }
}

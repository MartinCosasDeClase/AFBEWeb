import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="fondo"></div>
    <div class="card">
      <h1>Bienvenido a la Web de administración de la AFBE</h1>
      <p>Aquí podrás administrar todo para que los músicos estén bien informados.</p>
    </div>


  `

})
export class HomeComponent {}

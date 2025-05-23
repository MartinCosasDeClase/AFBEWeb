import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="blur-bg">
      <h1>Bienvenido a la Web de administración de la AFBE</h1>
      <p>Aqui podras administrar todo para que los músicos estén bien informados.</p>
    </div>
  `
})
export class HomeComponent {}

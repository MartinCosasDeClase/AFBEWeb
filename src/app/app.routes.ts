import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ActosComponent } from './actos/actos.component';
import { AuthGuard } from './auth/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'actos', component: ActosComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

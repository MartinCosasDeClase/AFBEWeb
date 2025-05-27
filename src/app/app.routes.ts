import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ActosComponent } from './actos/actos.component';
import { AuthGuard } from './auth/auth.guard';
import { UsuarioNuevoComponent } from './usuarios/usuario-nuevo.component';
import { UsuarioEliminarComponent } from './usuarios/usuario-delete.component';
import { ActoNuevoComponent } from './actos/acto-nuevo.component';
import { ActoAsistenciaComponent } from './actos/acto-asistencia.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'usuarios/nuevo', component: UsuarioNuevoComponent },
      { path: 'usuarios/eliminar', component: UsuarioEliminarComponent },
      { path: 'actos', component: ActosComponent },
      { path: 'actos/nuevo', component: ActoNuevoComponent },
      { path: 'actos/:actoId/asistencia', component: ActoAsistenciaComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

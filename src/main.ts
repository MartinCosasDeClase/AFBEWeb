import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './app/auth/JwtInterceptor';

import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule, FormsModule),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
}).catch(err => console.error(err));

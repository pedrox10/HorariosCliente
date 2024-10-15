import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { InicioComponent } from './app/componentes/inicio/inicio.component';

bootstrapApplication(InicioComponent, appConfig)
  .catch((err) => console.error(err));

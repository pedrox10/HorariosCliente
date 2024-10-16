import { RouterModule, Routes } from '@angular/router';
import { ListarTerminalesComponent } from './componentes/terminal/listar-terminales/listar-terminales.component';
import { ResumenMensualComponent } from './componentes/resumen-mensual/resumen-mensual.component';
import { ResumenUsuarioComponent } from './componentes/resumen-usuario/resumen-usuario.component';

export const routes: Routes = [
    { path: "", component: ListarTerminalesComponent },
    { path: "terminales", component: ListarTerminalesComponent },
    { path: "resumen/:ip/:puerto", component: ResumenMensualComponent}, 
    { path: "resumen-dia/:ip/:puerto", component: ResumenUsuarioComponent}];
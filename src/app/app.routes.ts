import {RouterModule, Routes} from '@angular/router';
import {ListarTerminalesComponent} from './componentes/terminal/listar-terminales/listar-terminales.component';
import {UsuariosComponent} from './componentes/usuarios/usuarios.component';
import {ResumenUsuarioComponent} from './componentes/usuarios/resumen-usuario/resumen-usuario.component';
import {AsignarHorariosComponent} from "./componentes/usuarios/asignar-horarios/asignar-horarios.component";
import {VerTurnosComponent} from "./componentes/usuarios/ver-turnos/ver-turnos.component";

export const routes: Routes = [
  {path: "", component: ListarTerminalesComponent},
  {path: "terminales", component: ListarTerminalesComponent},
  {path: "usuarios/:ip/:puerto", component: UsuariosComponent},
  {path: "resumen-usuario/:ip/:puerto/:nombre", component: ResumenUsuarioComponent},
  {path: "asignar-horarios", component: AsignarHorariosComponent},
  {path: "ver-turnos", component: VerTurnosComponent}
];

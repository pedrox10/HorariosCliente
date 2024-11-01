import {Routes} from '@angular/router';
import {ListarTerminalesComponent} from './componentes/terminal/listar-terminales/listar-terminales.component';
import {UsuariosComponent} from './componentes/usuarios/usuarios.component';
import {ResumenUsuarioComponent} from './componentes/usuarios/resumen-usuario/resumen-usuario.component';
import {AsignarHorariosComponent} from "./componentes/usuarios/asignar-horarios/asignar-horarios.component";
import {VerHorarioComponent} from "./componentes/usuarios/ver-horario/ver-horario.component";
import {HorariosComponent} from "./componentes/horarios/horarios.component";
import {AdmTerminalesComponent} from "./componentes/terminal/adm-terminales/adm-terminales.component";
import {NuevoHorarioComponent} from "./componentes/horarios/nuevo-horario/nuevo-horario.component";

export const routes: Routes = [
  {path: "", component: ListarTerminalesComponent},
  {path: "ver-terminales", component: ListarTerminalesComponent},
  {path: "usuarios/:ip/:puerto", component: UsuariosComponent},
  {path: "resumen-usuario/:ip/:puerto/:nombre", component: ResumenUsuarioComponent},
  {path: "horarios", component: HorariosComponent},
  {path: "nuevo-horario", component: NuevoHorarioComponent},
  {path: "asignar-horarios", component: AsignarHorariosComponent},
  {path: "ver-horario", component: VerHorarioComponent},
  {path: "adm-terminales", component: AdmTerminalesComponent},
];

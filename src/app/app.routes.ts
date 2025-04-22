import {Routes} from '@angular/router';
import {ListarTerminalesComponent} from './componentes/terminal/listar-terminales/listar-terminales.component';
import {UsuariosComponent} from './componentes/usuarios/usuarios.component';
import {VerMarcacionesComponent} from './componentes/usuarios/ver-marcaciones/ver-marcaciones.component';
import {AsignarHorariosComponent} from "./componentes/horarios/asignar-horarios/asignar-horarios.component";
import {VerHorarioComponent} from "./componentes/usuarios/ver-horario/ver-horario.component";
import {HorariosComponent} from "./componentes/horarios/horarios.component";
import {AdmTerminalesComponent} from "./componentes/terminal/adm-terminales/adm-terminales.component";
import {NuevoHorarioComponent} from "./componentes/horarios/nuevo-horario/nuevo-horario.component";
import {AsuetosComponent} from "./componentes/horarios/asuetos/asuetos.component";
import {EditarUsuarioComponent} from "./componentes/usuarios/editar-usuario/editar-usuario.component";
import {VerReporteComponent} from "./componentes/usuarios/ver-reporte/ver-reporte.component";
import {InterrupcionesComponent} from "./componentes/terminal/interrupciones/interrupciones.component";

export const routes: Routes = [
  {path: "", component: ListarTerminalesComponent},
  {path: "ver-terminales", component: ListarTerminalesComponent},
  {path: "terminal/:id/usuarios", component: UsuariosComponent},
  {path: "ver-marcaciones/:id/:ini/:fin", component: VerMarcacionesComponent},
  {path: "horarios", component: HorariosComponent},
  {path: "nuevo-horario", component: NuevoHorarioComponent},
  {path: "asignar-horarios", component: AsignarHorariosComponent},
  {path: "ver-horario/:id", component: VerHorarioComponent},
  {path: "asuetos", component: AsuetosComponent},
  {path: "adm-terminales", component: AdmTerminalesComponent},
  {path: "editar-usuario", component: EditarUsuarioComponent},
  {path: "ver-reporte", component: VerReporteComponent},
  {path: "interrupciones", component: InterrupcionesComponent},
];

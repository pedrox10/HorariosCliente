import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { TerminalComponent } from '../terminal.component';
import { TerminalService } from '../../../servicios/terminal.service';
import { HttpClientModule } from '@angular/common/http';
import {CommonModule, Location} from '@angular/common';
import {Terminal} from "../../../modelos/Terminal";
import {color} from "../../inicio/Global";
import {env} from "../../../../environments/environments";
import {DataService} from "../../../servicios/data.service";
import {Usuario} from "../../../modelos/Usuario";
import {Router} from "@angular/router";
import moment from "moment";
import {NotificacionesStateService} from "../../../servicios/notificaciones-state.service";

@Component({
  selector: 'app-listar-terminales',
  standalone: true,
  imports: [TerminalComponent, HttpClientModule, CommonModule],
  providers: [TerminalService, DataService],
  templateUrl: './listar-terminales.component.html',
  styleUrl: './listar-terminales.component.css'
})

export class ListarTerminalesComponent implements OnInit{
  @ViewChild('panelNotificaciones') panelNotificaciones?: ElementRef<HTMLDivElement>;
  public terminales: Terminal[] = [];
  public terminalesFiltrados: Terminal[] = [];
  public categorias = env.categorias;
  mostrarNotificaciones = false;
  public element = document.getElementById("terminales");
  public notificaciones: any = null;
  public semanaSeleccionada: 'actual' | 'anterior' = 'actual';
  usuarioSeleccionadoId?: number;
  private restaurarScrollPendiente = false;

  public constructor(public terminalService: TerminalService,
                     public dataService: DataService, private router: Router,
                     public location: Location, private notifState: NotificacionesStateService) {

  }

  ngOnInit(): void {
    this.getTerminales()
    this.getNotificaciones();
  }

  ngAfterViewInit() {
    const origen = sessionStorage.getItem('origen');
    if (origen === 'ver-marcaciones') {
      const state = this.notifState.getState();
      this.mostrarNotificaciones = state.mostrar;
      this.semanaSeleccionada = state.semana;
      this.usuarioSeleccionadoId = state.usuarioId;
      this.restaurarScrollPendiente = true;
      sessionStorage.removeItem('origen');
    } else {
      this.notifState.setState({ mostrar: false, semana: 'actual', scrollY: 0, usuarioId: undefined});
    }
  }

  ngAfterViewChecked() {
    if (this.restaurarScrollPendiente && this.panelNotificaciones) {
      const state = this.notifState.getState();
      this.panelNotificaciones.nativeElement.scrollTop = state.scrollY;
      this.restaurarScrollPendiente = false; // 👈 MUY IMPORTANTE
    }
  }

  getTerminales() {
    this.terminalService.getTerminales().subscribe(
      (data: any) => {
        this.terminales = data;
        console.log(this.terminales)
        this.terminalesFiltrados = this.terminales.slice();
        this.filtrarPorCategoria(env.posCategoria)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  buscar(texto: string) {
    const lower = texto.toLowerCase();
    this.terminalesFiltrados = this.terminales.filter(t =>
      t.nombre.toLowerCase().includes(lower) ||
      t.ip.toLowerCase().includes(lower)
    );
  }

  filtrarPorCategoria(index: number) {
    this.terminalesFiltrados = this.terminales.filter(t => t.categoria === index);
    env.posCategoria = index;
  }

  getColor(nombre: string) {
    return color(nombre)
  }

  isSelected(index: number): boolean {
    return env.posCategoria === index;
  }

  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
  }

  getNotificaciones() {
    this.notificaciones = this.dataService.getNotificaciones().subscribe(
      (data: any) => {
        this.notificaciones = data;
        console.log(this.notificaciones)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  verMarcaciones(usuario: any, terminal: any, semanaSeleccionada: string) {
    let usuarios: Usuario[] = [];
    usuarios.push(usuario)
    sessionStorage.setItem('origen', 'ver-marcaciones');
    let inicioSemana = moment(usuario.fechaInicio).format("YYYYMMDD");
    let finSemana = moment(usuario.fechaFin).format("YYYYMMDD");
    if (moment(terminal.fechaHastaEvaluada).isBefore(moment(usuario.fechaFin))) {
      finSemana = moment(terminal.fechaHastaEvaluada).format("YYYYMMDD")
    }

    const scroll = document.getElementById('panel-notificaciones')?.scrollTop ?? 0;
    this.notifState.setState({
      mostrar: true, semana: semanaSeleccionada as 'actual' | 'anterior',
      scrollY: scroll, usuarioId: usuario.id
    });
    this.router.navigate(['/terminal', terminal.id, 'ver-marcaciones', usuario.id, inicioSemana, finSemana],
      { state: { usuarios: usuarios }});
  }

  formatTime(fecha: string) {
    return moment(fecha).format("DD/MM/YYYY HH:mm")
  }

  formatDate(fecha: string) {
    return moment(fecha).format("DD/MM/YYYY")
  }
}

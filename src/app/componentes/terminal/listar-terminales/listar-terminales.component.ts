import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { TerminalComponent } from '../terminal.component';
import { TerminalService } from '../../../servicios/terminal.service';
import { HttpClientModule } from '@angular/common/http';
import {CommonModule, Location} from '@angular/common';
import {Terminal} from "../../../modelos/Terminal";
import {color, mensaje} from "../../inicio/Global";
import {env} from "../../../../environments/environments";
import {DataService} from "../../../servicios/data.service";
import {Usuario} from "../../../modelos/Usuario";
import {Router} from "@angular/router";
import moment from "moment";
import {NotificacionesStateService} from "../../../servicios/notificaciones-state.service";
import {finalize, switchMap} from "rxjs";

@Component({
  selector: 'app-listar-terminales',
  standalone: true,
  imports: [TerminalComponent, HttpClientModule, CommonModule],
  providers: [TerminalService, DataService],
  templateUrl: './listar-terminales.component.html',
  styleUrl: './listar-terminales.component.css'
})

export class ListarTerminalesComponent implements OnInit{
  @ViewChild('panelNotificaciones')
  set panel(el: ElementRef<HTMLDivElement> | undefined) {
    if (!el) return;
    this.panelNotificaciones = el;
    const state = this.notifState.getState();
    el.nativeElement.scrollTop = state.scrollY;
    this.restaurarScrollPendiente = false;
  }
  panelNotificaciones?: ElementRef<HTMLDivElement>;
  @ViewChild('searchBox', { static: true }) searchBox!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!this.searchBox.nativeElement.contains(target)) {
      this.mostrarResultadosBusqueda = false;
    }
  }
  public terminales: Terminal[] = [];
  public terminalesFiltrados: Terminal[] = [];
  public categorias = env.categorias;
  mostrarNotificaciones = false;
  public element = document.getElementById("terminales");
  public notificaciones: any = null;
  public semanaSeleccionada: 'actual' | 'anterior' = 'actual';
  usuarioSeleccionadoId?: number;
  private restaurarScrollPendiente = false;
  mostrarResultadosBusqueda = false;
  resultadosBusqueda: any[] = [];
  busquedaTexto = '';
  estadoMap: Record<number, { label: string; class: string }> = {
    0: { label: 'Inactivo', class: 'inactivo' },
    1: { label: 'Activo', class: 'activo' },
    2: { label: 'Eliminado', class: 'eliminado' }
  };
  esperaNotificaciones= false;

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
    if (origen === 'lista-terminales') {
      const state = this.notifState.getState();
      setTimeout(() => {
        this.mostrarNotificaciones = state.mostrar;
        this.semanaSeleccionada = state.semana;
        this.usuarioSeleccionadoId = state.usuarioId;
      });
      sessionStorage.removeItem('origen');
    } else {
      this.notifState.setState({ mostrar: false, semana: 'actual', scrollY: 0, usuarioId: undefined});
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

  onBuscarGlobal(event: Event) {
    const texto = (event.target as HTMLInputElement).value.trim();
    this.busquedaTexto = texto;

    if (texto.length < 3) {
      this.cerrarBusqueda();
      return;
    }
    this.dataService.buscarFuncionariosGlobal(texto).subscribe((data: any) => {
      this.resultadosBusqueda = data
      this.mostrarResultadosBusqueda = true;
    })

  }

  onFocusBusqueda() {
    if (this.busquedaTexto.length >= 3) {
      this.mostrarResultadosBusqueda = true;
    }
  }

  cerrarBusqueda() {
    this.mostrarResultadosBusqueda = false;
  }

  irAResultado(r: any) {
    this.mostrarResultadosBusqueda = false;

    this.router.navigate(
      ['/terminal', r.terminalId, 'usuarios'],
      {
        queryParams: { usuarioId: r.usuarioId }
      }
    );
  }

  actualizarNotificaciones() {
    this.esperaNotificaciones = true
    this.dataService.actualizarNotificaciones()
      .pipe(
        switchMap(()=> this.dataService.getNotificaciones()),
        finalize(() => this.esperaNotificaciones = false)
      ).subscribe({
        next: data => {
          this.notificaciones = data;
          mensaje("¡Las notificaciones fueron actualizadas!", "is-success")
        }, error: () => {
          mensaje("Error al actualizar notificaciones", "is-danger")
        }
      });
  }

  verMarcaciones(usuario: any, terminal: any, semanaSeleccionada: string) {
    let usuarios: Usuario[] = [];
    usuarios.push(usuario)
    sessionStorage.setItem('origen', 'lista-terminales');
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

  getEstadoLabel(estado: number): string {
    return this.estadoMap[estado]?.label ?? 'Desconocido';
  }

  getEstadoClass(estado: number): string {
    return this.estadoMap[estado]?.class ?? 'desconocido';
  }

  formatTime(fecha: string) {
    return moment(fecha).format("DD/MM/YYYY HH:mm")
  }

  formatDate(fecha: string) {
    return moment(fecha).format("DD/MM/YYYY")
  }
}

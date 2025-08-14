import {AfterViewInit, Component, HostListener, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {TerminalService} from "../../../servicios/terminal.service";
import {JornadaComponent} from "../../horarios/jornada/jornada.component";
import {Usuario} from "../../../modelos/Usuario";
import moment from "moment";
import 'moment/locale/es'
import {ModalService} from "ngx-modal-ease";
import {Terminal} from "../../../modelos/Terminal";
import {HorarioService} from "../../../servicios/horario.service";
import {env} from "../../../../environments/environments";
import {Jornada} from "../../../modelos/Jornada";
import {FormsModule} from "@angular/forms";
import {CommonModule, Location} from "@angular/common";
import {AsignarHorariosComponent} from "../../horarios/asignar-horarios/asignar-horarios.component";

@Component({
  selector: 'app-ver-horario',
  standalone: true,
  imports: [RouterLink, HttpClientModule, JornadaComponent, FormsModule, CommonModule],
  providers: [TerminalService, HorarioService],
  templateUrl: './ver-horario.component.html',
  styleUrl: './ver-horario.component.css'
})
export class VerHorarioComponent implements OnInit, AfterViewInit {

  public usuario: any | Usuario;
  public id: number | any;
  private activatedRoute = inject(ActivatedRoute);
  calendar: any = []
  public terminal: any | Terminal;
  gestionActual: number = 0;
  mesActual: number = 0;
  meses = env.meses
  jornadasSeleccionadas: any[] = [];
  jornadaIni: any = null;
  isRangeSelecting: boolean = false;
  hoverJornada: any = null;
  modoSeleccionRango: boolean = false;
  menuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };

  constructor(public terminalService: TerminalService, public horarioService: HorarioService,
              public modalService: ModalService, private location: Location) {
    this.gestionActual = moment().year()
    this.mesActual = moment().month()
    this.id = this.activatedRoute.snapshot.params['id'];
    this.terminalService.getUsuario(this.id).subscribe(
      (data: any) => {
        this.usuario = data;
      })
    this.horarioService.getJornadas(this.id, this.gestionActual, this.mesActual).subscribe(
      (data: any) => {
        this.calendar = data
        console.log(this.calendar)
      })
  }

  ngOnInit(): void {
    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        console.log("tecla ESC")
      }
    });
  }

  ngAfterViewInit() {
  }

  mesSiguiente() {
    if (this.mesActual == 11) {
      this.gestionActual = this.gestionActual + 1
      this.mesActual = 0;
    } else {
      this.mesActual++
    }
      this.horarioService.getJornadas(this.id, this.gestionActual, this.mesActual).subscribe(
        (data: any) => {
          this.calendar = data
          console.log(this.calendar)
        })
  }

  mesAnterior() {
    if (this.mesActual == 0) {
      this.gestionActual = this.gestionActual - 1
      this.mesActual = 11;
    } else {
      this.mesActual--;
    }
    this.horarioService.getJornadas(this.id, this.gestionActual, this.mesActual).subscribe(
      (data: any) => {
        this.calendar = data
        console.log(this.calendar)
      })
  }

  onJornadaClick(event: MouseEvent, jornada: any) {
    if (!this.modoSeleccionRango) return;
    if (!this.isRangeSelecting) {
      //Primer clic: limpiar todo y empezar nueva selección
      this.clearSelection();
      this.menuVisible = false
      this.jornadaIni = jornada;
      this.jornadasSeleccionadas = [jornada];
      this.isRangeSelecting = true;
    } else {
      //Segundo clic: finalizar selección de rango
      const allJornadas = this.calendar
        .flatMap((semana: any) => semana.dias.filter((d: any) => d != null));
      const startIndex = allJornadas.findIndex((j: Jornada) => j.fecha === this.jornadaIni.fecha);
      const endIndex = allJornadas.findIndex((j: Jornada) => j.fecha === jornada.fecha);
      const [from, to] = [startIndex, endIndex].sort((a, b) => a - b);
      this.jornadasSeleccionadas = allJornadas.slice(from, to + 1);
      let contenedorRef = (document.getElementById("modal-horario") as HTMLDivElement)
      const rect = contenedorRef.getBoundingClientRect();
      this.contextMenuPosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      this.menuVisible = true;
      // Reset de control de selección
      this.isRangeSelecting = false;
      this.jornadaIni = null;
      this.hoverJornada = null;
      console.log("Seleccionadas:", this.jornadasSeleccionadas);
    }
  }

  onToggleSeleccion() {
    if (!this.modoSeleccionRango) {
      this.clearSelection();
    }
  }

  clearSelection() {
    this.jornadasSeleccionadas = [];
    this.jornadaIni = null;
    this.hoverJornada = null;
    this.isRangeSelecting = false;
  }

  isSelected(jornada: any): boolean {
    return this.jornadasSeleccionadas.some(j => j.fecha === jornada?.fecha);
  }

  isInPreviewRange(jornada: any): boolean {
    if (!this.isRangeSelecting || !this.jornadaIni || !this.hoverJornada) return false;

    const allJornadas = this.calendar.flatMap((semana: any) => semana.dias.filter((d: any) => d != null));
    const startIndex = allJornadas.findIndex((j: Jornada) => j.fecha === this.jornadaIni.fecha);
    const hoverIndex = allJornadas.findIndex((j: Jornada) => j.fecha === this.hoverJornada.fecha);
    const [from, to] = [startIndex, hoverIndex].sort((a, b) => a - b);

    const currentIndex = allJornadas.findIndex((j: Jornada) => j.fecha === jornada.fecha);
    return currentIndex >= from && currentIndex <= to;
  }

  isRangeStart(jornada: any): boolean {
    if (!this.jornadasSeleccionadas.length) return false;
    return jornada.fecha === this.jornadasSeleccionadas[0].fecha;
  }

  isRangeEnd(jornada: any): boolean {
    if (!this.jornadasSeleccionadas.length) return false;
    return jornada.fecha === this.jornadasSeleccionadas[this.jornadasSeleccionadas.length - 1].fecha;
  }

  getFecha(jornada: any) {
    return moment(jornada.fecha).format("MMM DD")
  }

  modalAsignarHorario(usuario: Usuario) {
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    let usuarios: Usuario[] = [];
    usuarios.push(usuario);
    let fechaMin = usuario.fechaAlta;
    let fechaIni = this.jornadasSeleccionadas[0].fecha
    let fechaFin = this.jornadasSeleccionadas[this.jornadasSeleccionadas.length - 1].fecha;
    console.log(fechaIni + " " +fechaFin)
    this.modalService.open(AsignarHorariosComponent, {
      modal: {enter: `${config.animation} ${config.duration}`,},
      size: {padding: '0.5rem'},
      data: {usuarios, fechaMin, fechaIni, fechaFin}
    })
      .subscribe((data) => {
        if (data !== undefined) {
          console.log("Seleccionadas", this.jornadasSeleccionadas)
          console.log("Asignadas desde el servidor:", data.jornadasAsignadas);
          for (let semana of this.calendar) {
            for (let i = 0; i < semana.dias.length; i++) {
              const j = semana.dias[i];
              if (j) {
                const nueva = data.jornadasAsignadas.find((nj: any) =>
                  moment(nj.fecha).format('YYYY-MM-DD') === moment(j.fecha).format('YYYY-MM-DD'));
                if (nueva) {
                  semana.dias[i] = nueva;
                }
              }
            }
          }
        }
      });
  }

  imprimir() {
    window.print()
  }

  irAtras() {
    this.location.back();
  }
}

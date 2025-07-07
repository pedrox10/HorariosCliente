import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
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
import {CommonModule} from "@angular/common";

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
  calendar: any = []
  public terminal: any | Terminal;
  gestionActual: number = 0;
  mesActual: number = 0;
  meses = env.meses
  selectedJornadas: any[] = [];
  startJornada: any = null;
  isRangeSelecting: boolean = false;
  hoverJornada: any = null;
  modoSeleccionRango: boolean = false;
  menuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };

  constructor(private modalService: ModalService, public terminalService: TerminalService, public horarioService: HorarioService) {
    this.gestionActual = moment().year()
    this.mesActual = moment().month()
    let data: any = this.modalService.options?.data
    if (data) {
      this.id = data.id;
    } else {
      this.id= 78
      console.log(this.id)
    }
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
      // 👉 Primer clic: limpiar todo y empezar nueva selección
      this.clearSelection();
      this.menuVisible = false
      this.startJornada = jornada;
      this.selectedJornadas = [jornada];
      this.isRangeSelecting = true;
    } else {
      // 👉 Segundo clic: finalizar selección de rango
      const allJornadas = this.calendar
        .flatMap((semana: any) => semana.dias.filter((d: any) => d != null));
      const startIndex = allJornadas.findIndex((j: Jornada) => j.fecha === this.startJornada.fecha);
      const endIndex = allJornadas.findIndex((j: Jornada) => j.fecha === jornada.fecha);
      const [from, to] = [startIndex, endIndex].sort((a, b) => a - b);
      this.selectedJornadas = allJornadas.slice(from, to + 1);
      let contenedorRef = (document.getElementById("modal-horario") as HTMLDivElement)
      const rect = contenedorRef.getBoundingClientRect();
      this.contextMenuPosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      this.menuVisible = true;
      // Reset de control de selección
      this.isRangeSelecting = false;
      this.startJornada = null;
      this.hoverJornada = null;
      console.log("Seleccionadas:", this.selectedJornadas);
    }
  }

  onToggleSeleccion() {
    if (!this.modoSeleccionRango) {
      this.clearSelection();
    }
  }

  clearSelection() {
    this.selectedJornadas = [];
    this.startJornada = null;
    this.hoverJornada = null;
    this.isRangeSelecting = false;
  }

  isSelected(jornada: any): boolean {
    return this.selectedJornadas.some(j => j.fecha === jornada?.fecha);
  }

  isInPreviewRange(jornada: any): boolean {
    if (!this.isRangeSelecting || !this.startJornada || !this.hoverJornada) return false;

    const allJornadas = this.calendar.flatMap((semana: any) => semana.dias.filter((d: any) => d != null));
    const startIndex = allJornadas.findIndex((j: Jornada) => j.fecha === this.startJornada.fecha);
    const hoverIndex = allJornadas.findIndex((j: Jornada) => j.fecha === this.hoverJornada.fecha);
    const [from, to] = [startIndex, hoverIndex].sort((a, b) => a - b);

    const currentIndex = allJornadas.findIndex((j: Jornada) => j.fecha === jornada.fecha);
    return currentIndex >= from && currentIndex <= to;
  }

  isRangeStart(jornada: any): boolean {
    if (!this.selectedJornadas.length) return false;
    return jornada.fecha === this.selectedJornadas[0].fecha;
  }

  isRangeEnd(jornada: any): boolean {
    if (!this.selectedJornadas.length) return false;
    return jornada.fecha === this.selectedJornadas[this.selectedJornadas.length - 1].fecha;
  }

  getFecha(jornada: any) {
    return moment(jornada.fecha).format("MMM DD")
  }

  cerrarModal() {
    this.modalService.close();
  }

  imprimir() {
    window.print()
  }
}

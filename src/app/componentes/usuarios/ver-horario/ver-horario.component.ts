import {AfterViewInit, Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-ver-horario',
  standalone: true,
  imports: [RouterLink, HttpClientModule, JornadaComponent],
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

  constructor(private modalService: ModalService, public terminalService: TerminalService, public horarioService: HorarioService) {
    this.gestionActual = moment().year()
    this.mesActual = moment().month()
    let data: any = this.modalService.options?.data
    if (data) {
      this.id = data.id;
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

  contextMenu() {
    alert("Muestro")
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

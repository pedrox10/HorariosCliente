import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TerminalService} from "../../../servicios/terminal.service";
import {Location} from "@angular/common";
import {color, mensaje, notificacion} from "../../inicio/Global";
import {ComandosService} from "../../../servicios/comandos.service";
import moment from "moment";

@Component({
  selector: 'app-comandos',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  providers: [TerminalService],
  templateUrl: './comandos.component.html',
  styleUrl: './comandos.component.css'
})
export class ComandosComponent implements OnInit, AfterViewInit {
  private activatedRoute = inject(ActivatedRoute);
  public idTerminal = this.activatedRoute.snapshot.params['id'];
  nombreTerminal: string | any;
  ipTerminal: string | any;
  esConectar = false;
  esInfoCapacidad = false;
  esInfoExtra = false;
  esHoraActual = false;
  esSincronizarFecha = false;
  jsonInfoCapacidad: any;
  jsonInfoExtra: any;
  jsonHoraActual: any;
  jsonHoraServidor: any;

  constructor(private location: Location, private comandosService: ComandosService, private terminalService: TerminalService) {

  }

  ngOnInit(): void {
    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        this.ocultarInfoCapacidad()
        this.ocultarInfoExtra()
        this.ocultarHoraActual()
      }
    });
  }

  ngAfterViewInit() {
    this.terminalService.getTerminal(this.idTerminal).subscribe(
      (data: any) => {
        console.log(data)
        this.nombreTerminal = data.nombre
        this.ipTerminal = data.ip
      },
      (error: any) => {
        //this.accionError(error)
      }
    );
  }

  conectar() {
    document.getElementById("ic_conectar")?.classList.add("button", "is-loading");
    this.esConectar = true;
    this.comandosService.conectar(this.idTerminal).subscribe({
      next: (data: any) => {
        let respuesta = JSON.parse(data)
        if(respuesta.conectado === true)
          mensaje("¡Terminal con conexión!", "is-success")
        else
          mensaje("¡Terminal sin conexión!", "is-danger")
        document.getElementById("ic_conectar")?.classList.remove("button", "is-loading");
        this.esConectar = false;
      },
      error: err => {
        mensaje("¡Error en el servidor!", "is-danger")
        document.getElementById("ic_conectar")?.classList.remove("button", "is-loading");
        this.esConectar = false;
      }
    });
  }

  infoCapacidad() {
    document.getElementById("ic_info_cap")?.classList.add("button", "is-loading");
    this.esInfoCapacidad = true;
    this.comandosService.infoCapacidad(this.idTerminal).subscribe({
      next: (data: any) => {
        let respuesta = JSON.parse(data)
        if(respuesta.success === true) {
          this.jsonInfoCapacidad = respuesta.info_capacidad
          mensaje("¡Comando enviado!", "is-success")
          let div = document.getElementById("info_capacidad_modal") as HTMLDivElement
          setTimeout(() => {
            div.classList.add("is-active")
          }, 1000);
        } else
          mensaje("¡Terminal sin conexión!", "is-danger")
        document.getElementById("ic_info_cap")?.classList.remove("button", "is-loading");
        this.esInfoCapacidad = false;
      },
      error: err => {
        mensaje("¡Error en el servidor!", "is-danger")
        document.getElementById("ic_info_cap")?.classList.remove("button", "is-loading");
        this.esInfoCapacidad = false;
      }
    });
  }

  ocultarInfoCapacidad() {
    let div = document.getElementById("info_capacidad_modal") as HTMLDivElement
    div.classList.remove("is-active")
  }

  infoExtra() {
    document.getElementById("ic_info_extra")?.classList.add("button", "is-loading");
    this.esInfoExtra = true;
    this.comandosService.infoExtra(this.idTerminal).subscribe({
      next: (data: any) => {
        let respuesta = JSON.parse(data)
        if(respuesta.success === true) {
          this.jsonInfoExtra = respuesta.info_extra
          mensaje("¡Comando enviado!", "is-success")
          let div = document.getElementById("info_extra_modal") as HTMLDivElement
          setTimeout(() => {
            div.classList.add("is-active")
          }, 1000);
        } else
          mensaje("¡Terminal sin conexión!", "is-danger")
        document.getElementById("ic_info_extra")?.classList.remove("button", "is-loading");
        this.esInfoExtra = false;
      },
      error: err => {
        mensaje("¡Error en el servidor!", "is-danger")
        document.getElementById("ic_info_extra")?.classList.remove("button", "is-loading");
        this.esInfoExtra = false;
      }
    });
  }

  ocultarInfoExtra() {
    let div = document.getElementById("info_extra_modal") as HTMLDivElement
    div.classList.remove("is-active")
  }

  horaActual() {
    document.getElementById("ic_hora_actual")?.classList.add("button", "is-loading");
    this.esHoraActual = true;
    this.comandosService.horaActual(this.idTerminal).subscribe({
      next: (data: any) => {
        let respuesta = JSON.parse(data)
        if(respuesta.success === true) {
          this.jsonHoraActual = moment(respuesta.hora_actual).format("DD/MM/YYYY HH:mm:ss")
          this.jsonHoraServidor = moment(respuesta.hora_servidor).format("DD/MM/YYYY HH:mm:ss")
          mensaje("¡Comando enviado!", "is-success")
          let div = document.getElementById("hora_actual_modal") as HTMLDivElement
          setTimeout(() => {
            div.classList.add("is-active")
          }, 1000);
        } else
          mensaje("¡Terminal sin conexión!", "is-danger")
        document.getElementById("ic_hora_actual")?.classList.remove("button", "is-loading");
        this.esHoraActual = false;
      },
      error: err => {
        mensaje("¡Error en el servidor!", "is-danger")
        document.getElementById("ic_hora_actual")?.classList.remove("button", "is-loading");
        this.esHoraActual = false;
      }
    });
  }

  ocultarHoraActual() {
    let div = document.getElementById("hora_actual_modal") as HTMLDivElement
    div.classList.remove("is-active")
  }

  sincronizarfecha() {
    document.getElementById("ic_hora_actual")?.classList.add("button", "is-loading");
    this.esSincronizarFecha = true;
    this.comandosService.sincronizarFecha(this.idTerminal).subscribe({
      next: (data: any) => {
        let respuesta = JSON.parse(data)
        if(respuesta.success === true) {
          mensaje(respuesta.message, "is-success")
        } else
          mensaje("¡Terminal sin conexión!", "is-danger")
        document.getElementById("ic_hora_actual")?.classList.remove("button", "is-loading");
        this.esSincronizarFecha = false;
      },
      error: err => {
        mensaje("¡Error en el servidor!", "is-danger")
        document.getElementById("ic_hora_actual")?.classList.remove("button", "is-loading");
        this.esSincronizarFecha = false;
      }
    });
  }

  irAtras() {
    this.location.back();
  }

  getColor(nombre: string) {
    return color(nombre)
  }
}


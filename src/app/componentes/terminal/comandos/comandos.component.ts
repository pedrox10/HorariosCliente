import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TerminalService} from "../../../servicios/terminal.service";
import {Location} from "@angular/common";
import {color, mensaje, notificacion} from "../../inicio/Global";
import {ComandosService} from "../../../servicios/comandos.service";
import moment from "moment";
import {AuthService} from "../../../servicios/auth.service";
import {Terminal} from "../../../modelos/Terminal";
import {takeUntil} from "rxjs";
import {Usuario} from "../../../modelos/Usuario";

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
  esBorrarMarcaciones = false;
  esMantenimiento = false;
  jsonInfoCapacidad: any;
  jsonInfoExtra: any;
  jsonHoraActual: any;
  jsonHoraServidor: any;
  isSuperadmin: boolean;
  fc_confirmado = new FormControl(false);

  constructor(private location: Location, private comandosService: ComandosService,
              private terminalService: TerminalService, private authService: AuthService) {
    this.isSuperadmin  = this.authService.tieneRol('Superadmin');
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
          mensaje(respuesta.mensaje, "is-success")
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

  mostrarBorradoModal() {
    this.fc_confirmado.setValue(false)
    document.getElementById("confirmar_borrado_modal")?.classList.add("is-active");
  }

  ocultarBorradoModal() {
    document.getElementById("confirmar_borrado_modal")?.classList.remove("is-active");
  }

  sincronizarTerminal() {
    this.ocultarBorradoModal()
    let loader = document.getElementById("loader") as HTMLDivElement
    let textoEspera = document.getElementById("texto_espera") as HTMLParagraphElement
    textoEspera.innerText= "Sincronizando terminal ..."
    loader.classList.remove("is-hidden")
    this.terminalService.sincronizarTerminal(this.idTerminal).subscribe(
      (data: any) => {
        let respuesta = data;
        setTimeout(() => {
          document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
          loader.classList.add("is-hidden")
          mensaje(respuesta.mensaje, "is-success")
          this.borrarMarcaciones()
        }, 1000);

      },
      (error: any) => {
        let respuesta = error
        loader.classList.add("is-hidden")
        if(respuesta.error.mensaje === undefined) {
          mensaje("No se puede acceder al servidor", "is-danger")
        } else {
          mensaje(respuesta.error.mensaje, "is-danger")
        }
      })
  }

  borrarMarcaciones() {
    document.getElementById("ic_borrar_marcaciones")?.classList.add("button", "is-loading");
    this.esBorrarMarcaciones = true;
    this.comandosService.borrarMarcaciones(this.idTerminal).subscribe({
      next: (data: any) => {
        let respuesta = JSON.parse(data)
        if(respuesta.success === true) {
          mensaje(respuesta.mensaje, "is-success")
        } else
          mensaje("¡Terminal sin conexión!", "is-danger")
        document.getElementById("ic_borrar_marcaciones")?.classList.remove("button", "is-loading");
        this.esBorrarMarcaciones = false;
      },
      error: err => {
        mensaje("¡Error en el servidor!", "is-danger")
        document.getElementById("ic_borrar_marcaciones")?.classList.remove("button", "is-loading");
        this.esBorrarMarcaciones = false;
      }
    });
  }

  apagar() {
    document.getElementById("ic_mantenimiento")?.classList.add("button", "is-loading");
    this.esMantenimiento = true;
    this.comandosService.apagar(this.idTerminal).subscribe({
      next: (data: any) => {
        let respuesta = JSON.parse(data)
        if(respuesta.success === true) {
          mensaje(respuesta.mensaje, "is-success")
        } else
          mensaje("¡Terminal sin conexión!", "is-danger")
        document.getElementById("ic_mantenimiento")?.classList.remove("button", "is-loading");
        this.esMantenimiento = false;
      },
      error: err => {
        mensaje("¡Error en el servidor!", "is-danger")
        document.getElementById("ic_mantenimiento")?.classList.remove("button", "is-loading");
        this.esMantenimiento = false;
      }
    });
  }

  reiniciar() {
    document.getElementById("ic_mantenimiento")?.classList.add("button", "is-loading");
    this.esMantenimiento = true;
    this.comandosService.reiniciar(this.idTerminal).subscribe({
      next: (data: any) => {
        let respuesta = JSON.parse(data)
        if(respuesta.success === true) {
          mensaje(respuesta.mensaje, "is-success")
        } else
          mensaje("¡Terminal ya fué reiniciado! ó no tiene conexión", "is-danger")
        document.getElementById("ic_mantenimiento")?.classList.remove("button", "is-loading");
        this.esMantenimiento = false;
      },
      error: err => {
        mensaje("¡Error en el servidor!", "is-danger")
        document.getElementById("ic_mantenimiento")?.classList.remove("button", "is-loading");
        this.esMantenimiento = false;
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


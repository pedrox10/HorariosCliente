import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TerminalService} from "../../../servicios/terminal.service";
import {Location} from "@angular/common";
import {ModalService} from "ngx-modal-ease";
import {color, mensaje, notificacion} from "../../inicio/Global";
import {ComandosService} from "../../../servicios/comandos.service";

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
  jsonInfoCapacidad: any;
  jsonInfoExtra: any;

  constructor(private location: Location, private comandosService: ComandosService, private terminalService: TerminalService) {

  }

  ngOnInit(): void {

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
        }

        else
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
    let div = document.getElementById("info_capacidad_modal") as HTMLDivElement
    setTimeout(() => {
      div.classList.add("is-active")
    }, 1000);
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
        }
        else
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
    let div = document.getElementById("info_extra_modal") as HTMLDivElement
    setTimeout(() => {
      div.classList.add("is-active")
    }, 1000);
  }

  ocultarInfoExtra() {
    let div = document.getElementById("info_extra_modal") as HTMLDivElement
    div.classList.remove("is-active")
  }

  irAtras() {
    this.location.back();
  }

  getColor(nombre: string) {
    return color(nombre)
  }
}


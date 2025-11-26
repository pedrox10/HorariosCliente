declare const google: any;

import {Component, Injectable, OnInit} from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {AccionTerminalComponent} from "./accion-terminal/accion-terminal.component";
import {TerminalService} from "../../../servicios/terminal.service";
import {HttpClientModule} from "@angular/common/http";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Terminal} from "../../../modelos/Terminal";
import {Router, RouterLink} from '@angular/router';
import {color, format, formatDateTime, formatTime, mensaje, notificacion} from "../../inicio/Global";
import {Sincronizacion} from "../../../modelos/Sincronizacion";
import {env} from "../../../../environments/environments";
import {AuthService} from "../../../servicios/auth.service";
import {CommonModule} from "@angular/common";
import * as L from 'leaflet';

@Component({
  selector: 'app-adm-terminales',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink, CommonModule],
  providers: [TerminalService, AuthService],
  templateUrl: './adm-terminales.component.html',
  styleUrl: './adm-terminales.component.css'
})

@Injectable({
  providedIn: 'root'
})
export class AdmTerminalesComponent implements OnInit {

  public terminales: Terminal[] = [];
  public terminalesFiltrados: Terminal[] = [];
  public categorias = env.categorias;
  idActual: number = -1;
  nombreTerminal: string | any;
  ipTerminal: string | any;
  tieneConexion: boolean | any;
  sincronizaciones: Sincronizacion[] = [];
  fc_confirmado = new FormControl(false);
  isSuperadmin: boolean;
  map: any;

  constructor(public terminalService: TerminalService, private modalService: ModalService, private router: Router,
              private authService: AuthService) {
    this.isSuperadmin = this.authService.tieneRol('Superadmin');

  }

  ngOnInit() {
    this.getTerminales()
    console.log(env.posAdmCategoria)
    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        this.ocultarEliminar()
        this.ocultarSincronizaciones()
        this.ocultarUbicacion()
      }
    });
    document.getElementById("fondo_sinc")?.addEventListener("click", (e) => {
      this.ocultarSincronizaciones()
    })
    document.getElementById("fondo_eliminar")?.addEventListener("click", (e) => {
      this.ocultarEliminar()
    })
    document.getElementById("fondo_ubicacion")?.addEventListener("click", (e) => {
      this.ocultarUbicacion()
    })
  }

  add(terminal: Terminal) {
    if (terminal !== undefined) {
      console.log("agrego a  terminales")
      this.terminales.push(terminal);
      if (env.posAdmCategoria === -1) {
        this.terminalesFiltrados.push(terminal)
        console.log("agrego a filtrados")
      } else {
        if (env.posAdmCategoria === terminal.categoria) {
          this.terminalesFiltrados.push(terminal)
          console.log("agrego al filtro actual")
        }
      }
    }
  }

  edit(terminal: Terminal) {
    let index = this.terminales.map(i => i.id).indexOf(terminal.id);
    this.terminales[index] = terminal;
    if (env.posAdmCategoria === -1) {
      this.terminalesFiltrados[index] = terminal;
    } else {
      let indexFiltrados = this.terminalesFiltrados.map(i => i.id).indexOf(terminal.id);
      if (env.posAdmCategoria === terminal.categoria) {
        this.terminalesFiltrados[indexFiltrados] = terminal;
      } else {
        this.terminalesFiltrados.splice(indexFiltrados, 1)
      }
    }
  }

  delete() {
    document.getElementById("btn_eliminar")?.classList.add("is-loading");
    this.terminalService.eliminarTerminal(this.idActual).subscribe(
      (data: any) => {
        console.log(data)
        this.ocultarEliminar();
        document.getElementById("btn_eliminar")?.classList.remove("is-loading");
        let index = this.terminales.map(i => i.id).indexOf(this.idActual);
        this.terminales.splice(index, 1);
        if (env.posAdmCategoria === -1) {
          this.terminalesFiltrados.splice(index, 1)
        } else {
          let indexFiltrados = this.terminalesFiltrados.map(i => i.id).indexOf(this.idActual);
          if (env.posAdmCategoria === this.terminalesFiltrados[indexFiltrados].categoria) {
            this.terminalesFiltrados.splice(indexFiltrados, 1)
          }
        }
        mensaje("Terminal eliminado correctamente", "is-success")
      },
      (error: any) => {
        document.getElementById("btn_eliminar")?.classList.remove("is-loading");
        console.error('An error occurred:', error);
        mensaje("Ha ocurrido un error al eliminar", "is-danger")
      });
  }

  getTerminales() {
    this.terminalService.getTerminales().subscribe(
      (data: any) => {
        this.terminales = data;
        if (env.posAdmCategoria === -1)
          this.terminalesFiltrados = this.terminales.slice();
        else {
          this.terminalesFiltrados = this.terminales.filter(t => t.categoria === env.posAdmCategoria);
        }
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  filtrarPorCategoria(ev: any) {
    let index = parseInt(ev.target.value)
    if (index === -1) {
      this.terminalesFiltrados = this.terminales.slice();
    } else {
      this.terminalesFiltrados = this.terminales.filter(t => t.categoria === index);
    }
    env.posAdmCategoria = index;
  }

  agregarEditarModal(terminal: any) {
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    if (terminal === undefined) {
      this.modalService
        .open(AccionTerminalComponent, {
          modal: {enter: `${config.animation} ${config.duration}`,},
          size: {padding: '0.5rem'},
          overlay: {backgroundColor: "rgba(0, 0, 0, 0.65)"},
        })
        .subscribe((data) => {
          this.add(data)
        });
    } else {
      this.modalService
        .open(AccionTerminalComponent, {
          modal: {enter: `${config.animation} ${config.duration}`,},
          size: {padding: '0.5rem'},
          overlay: {backgroundColor: "rgba(0, 0, 0, 0.65)"},
          data: terminal
        })
        .subscribe((data) => {
          if (data !== undefined)
            this.edit(data)
        });
    }
  }

  mostrarSincronizaciones(terminal: Terminal) {
    document.getElementById("sincronizaciones_modal")?.classList.add("is-active");
    this.idActual = terminal.id;
    this.nombreTerminal = terminal.nombre
    this.ipTerminal = terminal.ip
    this.tieneConexion = terminal.tieneConexion
    this.terminalService.getSincronizaciones(this.idActual).subscribe(
      (data: any) => {
        this.sincronizaciones = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
    console.log(this.sincronizaciones)
  }

  mostrarUbicacion(terminal: Terminal) {
    if(terminal.latitud && terminal.longitud) {
      this.nombreTerminal = terminal.nombre
      document.getElementById("ubicacion_modal")?.classList.add("is-active");
      setTimeout(() => {
        this.iniMapa(terminal.nombre, terminal.latitud, terminal.longitud);
      }, 50);
    } else {
      mensaje("El biométrico aún no tiene una ubicación registrada.", "is-warning")
    }
  }

// Nuevo iniMapa con Google Maps gg
  iniMapa(nombre: string, lat: number, lng: number) {
    const mapDiv = document.getElementById('terminal-map');
    if (!mapDiv || typeof google === 'undefined' || !google.maps) {
      // Es posible que la API no se haya cargado aún si el callback no se usa.
      console.error("API de Google Maps no cargada o contenedor no encontrado.");
      return;
    }
    const mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Inicializar el mapa
    this.map = new google.maps.Map(mapDiv, mapOptions);
    // Agregar un marcador
    new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: this.map,
      title: nombre
    });
  }

  ocultarUbicacion() {
    document.getElementById("ubicacion_modal")?.classList.remove("is-active");
  }

  mostrarEliminar(terminal: Terminal) {
    this.fc_confirmado.setValue(false)
    document.getElementById("eliminar_modal")?.classList.add("is-active");
    this.idActual = terminal.id;
  }

  ocultarSincronizaciones() {
    document.getElementById("sincronizaciones_modal")?.classList.remove("is-active");
  }

  ocultarEliminar() {
    document.getElementById("eliminar_modal")?.classList.remove("is-active");
  }

  getColor(nombre: string) {
    return color(nombre)
  }

  isSelected(index: number): boolean {
    return env.posAdmCategoria === index;
  }

  formatear(fecha: Date) {
    let res = ""
    if (fecha === null) {
      res = "Nunca"
    } else {
      res = formatTime(fecha)
    }
    return res;
  }

  formatearTime(fecha: Date) {
    let res = ""
    if (fecha === null) {
      res = "Nunca"
    } else {
      res = formatDateTime(fecha)
    }
    return res;
  }
}

import {Component, Injectable, OnInit} from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {AccionTerminalComponent} from "./accion-terminal/accion-terminal.component";
import {TerminalService} from "../../../servicios/terminal.service";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {Terminal} from "../../../modelos/Terminal";
import {Router, RouterLink} from '@angular/router';
import {toast} from "bulma-toast";
import {color, format, formatTime} from "../../inicio/Global";

@Component({
  selector: 'app-adm-terminales',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  providers: [TerminalService],
  templateUrl: './adm-terminales.component.html',
  styleUrl: './adm-terminales.component.css'
})

@Injectable({
  providedIn: 'root'
})
export class AdmTerminalesComponent implements OnInit {

  public terminales: Terminal[] = [];
  idActual: number = -1;

  constructor(public terminalService: TerminalService, private modalService: ModalService, private router: Router) {

  }

  ngOnInit() {
    this.getTerminales()
    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        this.ocultarEliminar()
        this.ocultarSincronizaciones()
      }
    });
    document.getElementById("fondo_sinc")?.addEventListener("click", (e) => {
      this.ocultarSincronizaciones()
    })
    document.getElementById("fondo_eliminar")?.addEventListener("click", (e) => {
      this.ocultarEliminar()
    })
  }

  add(terminal: Terminal) {
    if (terminal !== undefined)
      this.terminales.push(terminal);
  }

  edit(terminal: Terminal) {
    const index = this.terminales.map(i => i.id).indexOf(terminal.id);
    console.log(index)
    this.terminales[index] = terminal;
  }

  delete() {
    document.getElementById("btn_eliminar")?.classList.add("is-loading");
    this.terminalService.eliminarTerminal(this.idActual).subscribe(
      (data: any) => {
        this.ocultarEliminar();
        document.getElementById("btn_eliminar")?.classList.remove("is-loading");
        const index = this.terminales.map(i => i.id).indexOf(this.idActual);
        this.terminales.splice(index, 1);
        toast({
          message: '<span class="icon" style="min-width: 175px;"><i style="color: white; font-size: 2em; padding-right: 10px" class="fas fa-check"></i>Terminal eliminado</span>',
          type: "is-success",
          position: "bottom-center",
          duration: 3000,
          animate: {in: 'bounceIn', out: 'bounceOut'},
        })
      },
      (error: any) => {
        document.getElementById("btn_eliminar")?.classList.remove("is-loading");
        console.error('An error occurred:', error);
        toast({
          message: '<span class="icon"><i style="color: white; font-size: 2em; padding-right: 15px" class="fas fa-delete"></i></span>Ha ocurrido un error',
          type: "is-danger",
          position: "bottom-center",
          duration: 4000,
          animate: {in: 'bounceIn', out: 'bounceOut'},
        })
      });
  }

  getTerminales() {
    this.terminalService.getTerminales().subscribe(
      (data: any) => {
        this.terminales = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
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
          if(data !== undefined)
            this.edit(data)
        });
    }
  }

  mostrarSincronizaciones(terminal: Terminal) {
    document.getElementById("sincronizaciones_modal")?.classList.add("is-active");
    this.idActual = terminal.id;
    console.log(this.idActual)
  }

  mostrarEliminar(terminal: Terminal) {
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

  formatear(fecha: Date){
    let res=""
    if(fecha === null) {
      res = "Nunca"
    } else {
      res = formatTime(fecha)
    }
    return res;
  }
}

import { Component } from '@angular/core';
import {Location} from "@angular/common";
import {Interrupcion} from "../../../modelos/Interrupcion";
import {AccionTerminalComponent} from "../adm-terminales/accion-terminal/accion-terminal.component";
import {ModalService} from "ngx-modal-ease";
import {AccionInterrupcionComponent} from "./accion-interrupcion/accion-interrupcion.component";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-interrupciones',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  templateUrl: './interrupciones.component.html',
  styleUrl: './interrupciones.component.css'
})

export class InterrupcionesComponent {

  public interrupciones: Interrupcion[] = [];

  constructor(private location: Location, private modalService: ModalService) {

  }

  agregarInterrupcionModal() {
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService
      .open(AccionInterrupcionComponent, {
        modal: {enter: `${config.animation} ${config.duration}`,},
        size: {padding: '0.5rem'},
        overlay: {backgroundColor: "rgba(0, 0, 0, 0.65)"},
      })
      .subscribe((data) => {
        if(data !== undefined)
          console.log( "ok")
      });
    console.log("abrir")
  }

  irAtras() {
    this.location.back();
  }
}

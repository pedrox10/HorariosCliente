import { Component } from '@angular/core';
import {Location} from "@angular/common";
import {Interrupcion} from "../../../modelos/Interrupcion";
import {AccionTerminalComponent} from "../adm-terminales/accion-terminal/accion-terminal.component";
import {ModalService} from "ngx-modal-ease";

@Component({
  selector: 'app-interrupciones',
  standalone: true,
  imports: [],
  templateUrl: './interrupciones.component.html',
  styleUrl: './interrupciones.component.css'
})

export class InterrupcionesComponent {

  public interrupciones: Interrupcion[] = [];

  constructor(private location: Location, private modalService: ModalService) {

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
          //this.add(data)
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
          //
          //
          // .if(data !== undefined)
            //this.edit(data)
        });
    }
  }

  irAtras() {
    this.location.back();
  }
}

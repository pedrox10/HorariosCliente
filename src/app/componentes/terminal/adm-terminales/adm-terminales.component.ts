import { Component } from '@angular/core';
import {NuevoHorarioComponent} from "../../horarios/nuevo-horario/nuevo-horario.component";
import {ModalService} from "ngx-modal-ease";
import {AccionTerminalComponent} from "./accion-terminal/accion-terminal.component";

@Component({
  selector: 'app-adm-terminales',
  standalone: true,
  imports: [],
  templateUrl: './adm-terminales.component.html',
  styleUrl: './adm-terminales.component.css'
})
export class AdmTerminalesComponent {
  config = {
    animation: 'enter-scaling',
    duration: '0.2s',
    easing: 'linear',
  };
  constructor(private modalService: ModalService) {
  }

  nuevoTerminal() {
    this.modalService
      .open(AccionTerminalComponent, {
        modal: {
          enter: `${this.config.animation} ${this.config.duration}`,
        },
        size: {
          padding: '0.5rem',
        },
      })
      .subscribe((data) => {
        console.log(data || '🚫 No data')
      });
  }
}

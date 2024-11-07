import {Component} from '@angular/core';

import {ModalService} from "ngx-modal-ease";
import {AccionTerminalComponent} from "./accion-terminal/accion-terminal.component";
import {TerminalService} from "../../../servicios/terminal.service";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-adm-terminales',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  providers: [TerminalService],
  templateUrl: './adm-terminales.component.html',
  styleUrl: './adm-terminales.component.css'
})
export class AdmTerminalesComponent {

  config = {
    animation: 'enter-scaling',
    duration: '0.2s',
    easing: 'linear',
  };

  constructor(public terminalService: TerminalService, private modalService: ModalService) {
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

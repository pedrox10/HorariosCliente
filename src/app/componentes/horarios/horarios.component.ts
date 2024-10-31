import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {ModalService} from "ngx-modal-ease";
import {NuevoHorarioComponent} from "./nuevo-horario/nuevo-horario.component";

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent {
  config = {
    animation: 'enter-scaling',
    duration: '0.2s',
    easing: 'linear',
  };
  constructor(private modalService: ModalService) {
  }

  nuevoHorario() {
    this.modalService
      .open(NuevoHorarioComponent, {
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

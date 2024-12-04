import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ModalService} from "ngx-modal-ease";
import {NuevoHorarioComponent} from "./nuevo-horario/nuevo-horario.component";
import {Horario} from "../../modelos/Horario";
import {HorarioService} from "../../servicios/horario.service";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  providers: [HorarioService],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit{
  config = {
    animation: 'enter-scaling',
    duration: '0.2s',
    easing: 'linear',
  };

  horarios: Horario[] = [];
  id_actual: number = -1;

  constructor(public horarioService: HorarioService, private modalService: ModalService) {

  }

  ngOnInit(): void {
    this.horarioService.getHorarios().subscribe(
      (data: any) => {
        console.log(data)
        this.horarios = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
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

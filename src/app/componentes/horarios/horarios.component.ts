import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ModalService} from "ngx-modal-ease";
import {NuevoHorarioComponent} from "./nuevo-horario/nuevo-horario.component";
import {Horario} from "../../modelos/Horario";
import {HorarioService} from "../../servicios/horario.service";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {color, mensaje} from "../inicio/Global";
import {Terminal} from "../../modelos/Terminal";

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  providers: [HorarioService],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent implements OnInit {
  config = {
    animation: 'enter-scaling',
    duration: '0.2s',
    easing: 'linear',
  };

  horarios: Horario[] = [];
  horario: Horario|any = undefined;

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
        mensaje("No se obtener informacion del servidor", "is-danger")
      }
    );
    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        this.ocultarEliminar()
      }
    });
    document.getElementById("background")?.addEventListener("click", (e) => {
      this.ocultarEliminar()
    })
  }

  verificarHorario(horario: Horario) {
    this.horarioService.getNumJornadas(horario.id).subscribe(
      (data: any) => {
        let numJornadas = data.res;
        console.log(numJornadas)
        if(numJornadas > 0) {
          mensaje("Un horario con jornadas ya asignadas, no se puede eliminar", "is-warning")
        } else
          this.mostrarEliminar(horario)
      },
      (error: any) => {
        console.error('An error occurred:', error);
        mensaje("No se obtener informacion del servidor", "is-danger")
      }
    )
  }

  mostrarEliminar(horario: Horario) {
    document.getElementById("eliminar_modal")?.classList.add("is-active");
    this.horario = horario;
  }

  eliminarHorario() {
    this.horarioService.eliminarHorario(this.horario.id).subscribe(
      (data: any) => {
        console.log(data)
        this.ocultarEliminar()
        const index = this.horarios.map(i => i.id).indexOf(this.horario.id);
        this.horarios.splice(index, 1);
        mensaje("El horario fué eliminado", "is-success")
      },
      (error: any) => {
        console.error('An error occurred:', error);
        mensaje("No se pudo eliminar el horario", "is-danger")
      }
    )
  }

  getNombreHorario() {
    let res = ""
    if(this.horario !== undefined)
      res = this.horario.nombre
    return res;
  }

  ocultarEliminar() {
    document.getElementById("eliminar_modal")?.classList.remove("is-active");
  }

  getColor(nombre: string) {
    return color(nombre);
  }
}

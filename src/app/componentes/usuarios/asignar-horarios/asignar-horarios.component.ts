import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";
import {ModalService} from "ngx-modal-ease";
import {Location} from "@angular/common";
import {Usuario} from "../../../modelos/Usuario";
import {easepick} from "@easepick/core";
import {RangePlugin} from "@easepick/range-plugin";
import {HorarioService} from "../../../servicios/horario.service";
import {Horario} from "../../../modelos/Horario";
import {env} from "../../../../environments/environments";

@Component({
  selector: 'app-asignar-horarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule],
  providers: [HorarioService],
  templateUrl: './asignar-horarios.component.html',
  styleUrl: './asignar-horarios.component.css'
})
export class AsignarHorariosComponent implements OnInit, AfterViewInit {
  dias = env.dias.map((dia) => dia.toLowerCase());
  horarios: Horario[] = [];
  jornadaDias: any[] = [];
  formAccion = new FormGroup({});
  usuarios: Usuario[] = [];

  constructor(private modalService: ModalService, public horarioService: HorarioService) {
    this.horarioService.getHorarios().subscribe(
      (data: any) => {
        this.horarios = data;
        console.log(this.horarios)
      }, (error: any) => {
        console.error("Error cargando horarios", error)
      })
  }

  cerrarModal() {
    this.modalService.close();
  }

  seleccionar(ev: any) {
    let id: number = parseInt(ev.target.value)
    const index = this.horarios.findIndex(x => x.id === id);
    let horario = this.horarios[index];
    document.getElementById("tolerancia")!.innerText = horario.tolerancia + " min.";
    document.getElementById("color")!.innerText = JSON.parse(horario.color).color;
    this.jornadaDias = horario.jornadaDias
    console.log(this.jornadaDias)
  }

  ngOnInit(): void {
    let data: any = this.modalService.options?.data
    if(data){
      this.usuarios = data.usuarios;
      this.usuarios.forEach(usuario => {
        console.log(usuario.nombre)
      })
      const selectedIds = this.usuarios.map(({ id }) => id);
      console.log(selectedIds);
    }
  }

  ngAfterViewInit() {
    const picker = new easepick.create({
      element: document.getElementById('datepicker')!,
      lang: 'es-ES',
      format: "DD/MM/YYYY",
      zIndex: 10,
      grid: 2,
      calendars: 2,
      css: [
        '../../../assets/easepick.css',
        "../../../assets/easepick_custom.css"
      ],
      plugins: [RangePlugin],
      RangePlugin: {
        tooltipNumber(num) {
          return num - 1;
        },
        locale: {
          one: 'dia',
          other: 'dias',
        },
      },
    });
  }
}

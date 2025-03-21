import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalService} from "ngx-modal-ease";
import {Usuario} from "../../../modelos/Usuario";
import {easepick} from "@easepick/core";
import {RangePlugin} from "@easepick/range-plugin";
import {HorarioService} from "../../../servicios/horario.service";
import {Horario} from "../../../modelos/Horario";
import {env} from "../../../../environments/environments";
import moment from "moment";
import {LockPlugin} from "@easepick/lock-plugin";
import {TerminalService} from "../../../servicios/terminal.service";
import {color, mensaje} from "../../inicio/Global";

@Component({
  selector: 'app-asignar-horarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [HorarioService, TerminalService],
  templateUrl: './asignar-horarios.component.html',
  styleUrl: './asignar-horarios.component.css'
})
export class AsignarHorariosComponent implements OnInit, AfterViewInit {
  dias = env.dias.map((dia) => dia.toLowerCase());
  horarios: Horario[] = [];
  jornadaDias: any[] = [];
  formAsignar: FormGroup | any = new FormGroup({});
  usuarios: Usuario[] = [];
  picker: HTMLInputElement| any = undefined;
  fechaMin: string|any = undefined;

  constructor(private modalService: ModalService, public horarioService: HorarioService, public terminalService: TerminalService) {
    this.horarioService.getHorarios().subscribe(
      (data: any) => {
        this.horarios = data;
        console.log(this.horarios)
      }, (error: any) => {
        console.error("Error cargando horarios", error)
      })
      let fc_fecha = new FormControl("", [Validators.required])
      let fc_horario = new FormControl("", [Validators.required])
      this.formAsignar.addControl("fecha", fc_fecha)
      this.formAsignar.addControl("horario", fc_horario)
  }

  ngOnInit(): void {
    let data: any = this.modalService.options?.data
    if(data){
      this.usuarios = data.usuarios;
      this.fechaMin = data.fechaMin;
      console.log(this.fechaMin)
      this.usuarios.forEach(usuario => {
        console.log(usuario.nombre)
      })

    }
  }

  ngAfterViewInit() {
     this.picker = new easepick.create({
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
      plugins: [RangePlugin, LockPlugin],
      RangePlugin: {
        tooltipNumber(num) {
          return num;
        },
        locale: {
          one: 'dia',
          other: 'dias',
        },
      },
       LockPlugin: {
        minDate: moment(this.fechaMin, "YYYY-MM-DD").toDate(),
        maxDays: 92,
       },
    });
    this.picker.gotoDate(moment().subtract(1, "month").toDate());
    this.picker.on("select", (e: any) => {
      console.log(this.picker.getStartDate().format('DD-MM-YYYY'))
    })
  }

  seleccionar(ev: any) {
    let id: number = parseInt(ev.target.value)
    const index = this.horarios.findIndex(x => x.id === id);
    let horario = this.horarios[index];
    document.getElementById("tolerancia")!.innerText = horario.tolerancia + " min.";
    document.getElementById("nombre_color")!.innerText = horario.color;
    document.getElementById("valor_color")!.style.color = color(horario.color)
    document.getElementById("descripcion")!.innerText = horario.descripcion;
    document.getElementById("area")!.innerText = horario.area;
    this.jornadaDias = horario.jornadaDias
    console.log(this.jornadaDias)
  }

  asignarHorario() {
    document.getElementById("btn_asignar")?.classList.add("is-loading");
    let selectHorarios = document.getElementById("select_horarios") as HTMLSelectElement
    let id_horario = selectHorarios.value
    let ids = this.usuarios.map(({ id }) => id);
    let ini = this.picker.getStartDate().format('YYYYMMDD')
    let fin = this.picker.getEndDate().format('YYYYMMDD')
    let jornadas = JSON.stringify(this.jornadaDias);
    this.horarioService.asignarHorario(parseInt(id_horario), ids.toString(), ini, fin, jornadas).
    subscribe((data:any)=>{
      setTimeout(() => {
        document.getElementById("btn_asignar")?.classList.remove("is-loading")
        mensaje("Horario asignado a " + this.usuarios.length + " funcionarios", "is-success")
        this.modalService.close(data)
      }, 1000);
    }, (error: any) => {
        mensaje("Error, no se pudo asignar el horario", "is-danger")
    })
  }

  cambiaHora(evt: any, anterior: string, tipo: string, index: number) {
    if (evt.key === "Delete" || evt.key === "Backspace") {
      evt.target.value = anterior
    } else {
      switch (tipo) {
        case "priEntrada":
          this.jornadaDias[index].priEntrada = evt.target.value;
          break;
        case "priSalida":
          this.jornadaDias[index].priSalida = evt.target.value;
          break;
        case "segEntrada":
          this.jornadaDias[index].segEntrada = evt.target.value;
          break;
        case "segSalida":
          this.jornadaDias[index].segSalida = evt.target.value;
          break;
      }
    }
    console.log(this.jornadaDias)
  }

  cerrarModal() {
    this.modalService.close();
  }
}

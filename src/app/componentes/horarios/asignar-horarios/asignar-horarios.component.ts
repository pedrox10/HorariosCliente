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
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-asignar-horarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule, ReactiveFormsModule, CommonModule],
  providers: [HorarioService, TerminalService],
  templateUrl: './asignar-horarios.component.html',
  styleUrl: './asignar-horarios.component.css'
})
export class AsignarHorariosComponent implements OnInit, AfterViewInit {
  dias = env.dias.map((dia) => dia.toLowerCase());
  horarios: Horario[] = [];
  horario: Horario|any = undefined;
  jornadaDias: any[] = [];
  formAsignar: FormGroup | any = new FormGroup({});
  usuarios: Usuario[] = [];
  picker: HTMLInputElement | any;
  fechaMin: string | any;
  fechaIni: string | any;
  fechaFin: string | any;
  diasConFechas: { [dia: string]: string } = {};
  longitudRango: number = 0;

  constructor(private modalService: ModalService, public horarioService: HorarioService, public terminalService: TerminalService) {
    this.horarioService.getHorarios().subscribe(
      (data: any) => {
        this.horarios = data;
        console.log(this.horarios)
      }, (error: any) => {
        console.error("Error cargando horarios", error)
      })
      let fc_fecha = new FormControl("", [Validators.required]);
      let fc_horario = new FormControl("", [Validators.required])
      let fc_invierno = new FormControl({ value: false, disabled: true })
      let fc_lactancia = new FormControl({ value: false, disabled: true })
      this.formAsignar.addControl("fecha", fc_fecha)
      this.formAsignar.addControl("horario", fc_horario)
      this.formAsignar.addControl("invierno", fc_invierno)
      this.formAsignar.addControl("lactancia", fc_lactancia)
  }

  ngOnInit(): void {
    let data: any = this.modalService.options?.data
    console.log(data)
    if(data){
      this.usuarios = data.usuarios;
      this.fechaMin = data.fechaMin;
      this.fechaIni = data.fechaIni;
      this.fechaFin = data.fechaFin;
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
        maxDate: moment().endOf("year").toDate()
       },
    });
    this.picker.gotoDate(moment().subtract(1, "month").toDate());
    if(this.fechaIni && this.fechaFin) {
      this.picker.setStartDate(moment(this.fechaIni, "YYYY-MM-DD").toDate());
      this.picker.setEndDate(moment(this.fechaFin, "YYYY-MM-DD").toDate())
      setTimeout(() => {
        this.actualizarFechasSeleccionadas();
      });
    }
    this.picker.on("select", (e: any) => {
      this.actualizarFechasSeleccionadas();
    });
  }

  private actualizarFechasSeleccionadas() {
    const startDate = moment(this.picker.getStartDate());
    const endDate = moment(this.picker.getEndDate());

    this.formAsignar.get("fecha")?.setValue(`${startDate.format("DD/MM/YYYY")} - ${endDate.format("DD/MM/YYYY")}`);
    const diffDias = endDate.diff(startDate, 'days') + 1;
    this.longitudRango = diffDias;

    const map: { [dia: string]: string } = {};
    for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
      const diaNombre = this.getNombreDia(m.toDate());
      if (!map[diaNombre]) {
        map[diaNombre] = m.format("DD MMM").replace('.', '');
      }
    }
    this.diasConFechas = map;
  }

  seleccionar(ev: any) {
    let id: number = parseInt(ev.target.value)
    const index = this.horarios.findIndex(x => x.id === id);
    let horario = this.horarios[index];
    this.horario = this.horarios[index];
    this.formAsignar.get('invierno')?.enable();
    this.formAsignar.get('lactancia')?.enable();
    this.jornadaDias = JSON.parse(JSON.stringify(horario.jornadaDias));
    this.formAsignar.get("invierno").setValue(false);
    this.formAsignar.get("lactancia").setValue(false);
    document.getElementById("tolerancia")!.innerText = horario.tolerancia + " min.";
    document.getElementById("nombre_color")!.innerText = horario.color;
    document.getElementById("valor_color")!.style.color = color(horario.color)
    document.getElementById("descripcion")!.innerText = horario.descripcion;
    document.getElementById("area")!.innerText = horario.area;
    if(horario.incluyeFeriados) {
      document.getElementById("feriados")!.innerHTML = "<span title='Incluye días feriados' class='badge is-right is-light is-success'" +
        "style='cursor: pointer; border-color: #9bd0d0; line-height: 10px;'>" + "+F </span>"
    } else {
      document.getElementById("feriados")!.innerHTML = "";
    }
  }

  asignarHorario() {
    //console.log(this.formAsignar)
    document.getElementById("btn_asignar")?.classList.add("is-loading");
    let selectHorarios = document.getElementById("select_horarios") as HTMLSelectElement
    let id_horario = selectHorarios.value
    let ids = this.usuarios.map(({ id }) => id);
    let ini = this.picker.getStartDate().format('YYYYMMDD')
    let fin = this.picker.getEndDate().format('YYYYMMDD')
    let esInvierno = this.formAsignar.get('invierno').value;
    let esLactancia = this.formAsignar.get('lactancia').value
    let jornadas = JSON.stringify(this.jornadaDias);
    this.horarioService.asignarHorario(parseInt(id_horario), ids.toString(), ini, fin, jornadas, esInvierno, esLactancia).
    subscribe((data:any)=>{
      setTimeout(() => {
        document.getElementById("btn_asignar")?.classList.remove("is-loading")
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

  aplicaInvierno(event: any) {
    let esSeleccionado = (<HTMLInputElement>event.target).checked
    this.ajustarHorarioInvierno(esSeleccionado);
  }

  ajustarHorarioInvierno(isInvierno: boolean) {
    this.jornadaDias.forEach((jornada) => {
      if (jornada.habilitado) {
        jornada.priEntrada = this.ajustarHora(jornada.priEntrada, isInvierno);
        jornada.priSalida = this.ajustarHora(jornada.priSalida, isInvierno);
        if (jornada.segEntrada && jornada.segSalida) {
          jornada.segEntrada = this.ajustarHora(jornada.segEntrada, isInvierno);
          jornada.segSalida = this.ajustarHora(jornada.segSalida, isInvierno);
        }
      }
    });
  }

  ajustarHora(hora: string, sumar: boolean): string {
    return moment(hora, "HH:mm")
      .add(sumar ? 30 : -30, "minutes")
      .format("HH:mm");
  }

  cerrarModal() {
    this.modalService.close();
  }

  getClase(index: number) {
    let res=""
    if(this.horario.diasIntercalados || this.horario.jornadasDosDias && !this.horario.incluyeFeriados) {
      if(index % 2 == 0)
        res="par"
      else res="impar"
    }
    return res;
  }

  getColor(nombre: string) {
    return color(nombre)
  }

  estaIncluido(dia: any): boolean {
    const inicio = this.picker.getStartDate();
    const fin = this.picker.getEndDate();
    // Verifica si algún día del rango cae en el día dado
    for (let m = moment(inicio); m.isSameOrBefore(fin, 'day'); m.add(1, 'days')) {
      if (this.getNombreDia(m.toDate()) === dia) return true;
    }
    return false;
  }

  getNombreDia(fecha: Date): string {
    return moment(fecha)
      .locale("es")
      .format('dddd')
      .normalize("NFD")                     // separa letras y tildes
      .replace(/[\u0300-\u036f]/g, "")     // elimina los caracteres diacríticos
      .replace(/^\w/, c => c.toUpperCase()); // capitaliza la primera letra
  }
}

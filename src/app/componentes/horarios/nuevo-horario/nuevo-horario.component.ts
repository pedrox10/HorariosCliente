import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {Location} from '@angular/common';
import {env} from "../../../../environments/environments";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HorarioService} from "../../../servicios/horario.service";
import {HttpClientModule} from "@angular/common/http";
import {isEmpty} from "rxjs";

@Component({
  selector: 'app-nuevo-horario',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  providers: [HorarioService],
  templateUrl: './nuevo-horario.component.html',
  styleUrl: './nuevo-horario.component.css'
})
export class NuevoHorarioComponent implements OnInit {
  dias = env.dias.map((dia) => dia.toLowerCase());
  colores = env.colores;
  formHorario: FormGroup | any = new FormGroup({});
  formJornadas: FormGroup | any = new FormGroup({});
  dd_color: any;
  inputColor: any;

  constructor(private modalService: ModalService, private location: Location, public horarioService: HorarioService) {
    let fc_nombre = new FormControl("", [Validators.required, Validators.maxLength(12)])
    let fc_tolerancia = new FormControl("5", [Validators.required])
    let fc_color = new FormControl("", [Validators.required])
    let fc_descripcion = new FormControl("", [Validators.required])

    this.formHorario.addControl("nombre", fc_nombre)
    this.formHorario.addControl("tolerancia", fc_tolerancia)
    this.formHorario.addControl("color", fc_color)
    this.formHorario.addControl("descripcion", fc_descripcion)

  }

  ngOnInit() {
    this.dd_color = document.getElementById("dd_color") as HTMLDivElement

    for (let dia of this.dias) {
      this.formJornadas.addControl(dia + "_habilitado", new FormControl(false, [Validators.required]))
      this.formJornadas.addControl(dia + "_pri_entrada", new FormControl(null, [Validators.required]))
      this.formJornadas.addControl(dia + "_pri_salida", new FormControl(null, [Validators.required]))
      this.formJornadas.addControl(dia + "_seg_entrada", new FormControl(null, [Validators.required]))
      this.formJornadas.addControl(dia + "_seg_salida", new FormControl(null, [Validators.required]))
    }
  }

  guardarHorario() {
    let verificado: boolean = true;
    let fila: HTMLTableRowElement | any;
    for (let dia of this.dias) {
      fila = document.getElementById(dia)
      let habilitado = this.getControl(dia + "_habilitado").value
      if (habilitado) {
        let pri_entrada = this.getControl(dia + "_pri_entrada").value
        let pri_salida = this.getControl(dia + "_pri_salida").value
        if (this.tieneSegTurno(dia)) {
          let seg_entrada = this.getControl(dia + "_seg_entrada").value
          let seg_salida = this.getControl(dia + "_seg_salida").value
          if (this.esVacio(pri_entrada) || this.esVacio(pri_salida) || this.esVacio(seg_entrada) || this.esVacio(seg_salida)) {
            fila.classList.add("animado")
            setTimeout(() => {
              fila.classList.remove("animado")
            }, 2000)
            verificado = false;
            break;
          }
        } else {
          if (this.esVacio(pri_entrada) || this.esVacio(pri_salida)) {
            fila.classList.add("animado")
            setTimeout(() => {
              fila.classList.remove("animado")
            }, 2000)
            verificado = false;
            break;
          }
        }
      }
    }
    if (verificado) {
      this.horarioService.crearHorario(JSON.stringify(this.formHorario.value), JSON.stringify(this.formJornadas.value)).subscribe((data: any) => {
        console.log(data)
      }, (error: any) => {
        console.log(error)
      });
    } else {
      console.log("No vreirfica")
    }
  }

  irAtras() {
    this.location.back();
  }

  get f() {
    return this.formHorario.controls;
  }

  getControl(key: string) {
    return this.formJornadas.controls[key];
  }

  reset(dia: string) {
    this.formJornadas.controls[dia + "_pri_entrada"].reset()
    this.formJornadas.controls[dia + "_pri_salida"].reset()
    this.formJornadas.controls[dia + "_seg_entrada"].reset()
    this.formJornadas.controls[dia + "_seg_salida"].reset()
  }

  changed(evt: any) {
    let isChecked = (<HTMLInputElement>evt.target).checked
    let id = evt.target.name.split("_");
    let dia = document.getElementById(id[0]);
    let collection = dia?.getElementsByTagName("td") || []
    for (let i = 0; i < collection.length; i++) {
      if (i != 0) {
        if (isChecked)
          collection[i].classList.remove("desactivado");
        else {
          collection[i].classList.add("desactivado");
          this.reset(id[0])
        }
      }
    }
  }

  agregarTurno(dia: string) {
    let turno = document.getElementById(dia + "_seg_turno");
    turno?.classList.remove("oculto")
  }

  quitarTurno(dia: string) {
    let turno = document.getElementById(dia + "_seg_turno");
    turno?.classList.add("oculto")
  }

  tieneSegTurno(dia: string) {
    let res = false;
    let turno = document.getElementById(dia + "_seg_turno");
    if (!turno?.classList.contains("oculto"))
      res = true;
    return res;
  }

  mostrarColores(evt: any) {
    let boton = evt.target as HTMLButtonElement;
    if (this.dd_color.classList.contains("is-active")) {
      this.dd_color.classList.remove("is-active")
    } else {
      this.dd_color.classList.add("is-active")
    }
  }

  seleccionarColor(item: any) {
    let boton = document.getElementById("btn_color") as HTMLButtonElement;
    let texto = document.getElementById("txt_color") as HTMLSpanElement;
    texto.textContent = item.color
    boton.style.backgroundColor = item.valor
    this.formHorario.controls.color.setValue(JSON.stringify(item))
    console.log(this.formHorario.value)
    this.dd_color.classList.remove("is-active")
  }

  esVacio(value: string) {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
  }
}

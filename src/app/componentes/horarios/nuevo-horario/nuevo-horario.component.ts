import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {Location} from '@angular/common';
import {env} from "../../../../environments/environments";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HorarioService} from "../../../servicios/horario.service";
import {HttpClientModule} from "@angular/common/http";
import {mensaje} from "../../inicio/Global";

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
  dias_impares =  env.dias_impares;
  dias_pares =  env.dias_pares;
  colores: any = env.colores;
  formHorario: FormGroup | any = new FormGroup({});
  formJornadas: FormGroup | any = new FormGroup({});
  dd_color: any;

  constructor(private modalService: ModalService, private location: Location, public horarioService: HorarioService) {
    let fc_nombre = new FormControl("", [Validators.required, Validators.maxLength(12)])
    let fc_tolerancia = new FormControl("5", [Validators.required])
    let fc_color = new FormControl("", [Validators.required])
    let fc_descripcion = new FormControl("", [])
    let fc_dias_intercalados= new FormControl(false, [])
    let fc_jornadas_dos_dias = new FormControl(false, [])

    this.formHorario.addControl("nombre", fc_nombre)
    this.formHorario.addControl("tolerancia", fc_tolerancia)
    this.formHorario.addControl("color", fc_color)
    this.formHorario.addControl("descripcion", fc_descripcion)
    this.formHorario.addControl("diasIntercalados", fc_dias_intercalados)
    this.formHorario.addControl("jornadasDosDias", fc_jornadas_dos_dias)

  }

  ngOnInit() {

    console.log(this.formHorario.get('jornadasDosDias').value);
    this.dd_color = document.getElementById("dd_color") as HTMLDivElement
    for (let dia of this.dias) {
      this.formJornadas.addControl(dia + "_habilitado", new FormControl(false, [Validators.required]))
      this.formJornadas.addControl(dia + "_pri_entrada", new FormControl(null, [Validators.required]))
      this.formJornadas.addControl(dia + "_pri_salida", new FormControl(null, [Validators.required]))
      this.formJornadas.addControl(dia + "_seg_entrada", new FormControl(null, [Validators.required]))
      this.formJornadas.addControl(dia + "_seg_salida", new FormControl(null, [Validators.required]))
    }
    document.addEventListener('click', (event) => {
      let el = (event.target) as HTMLElement;
      if (!document.getElementById("dropdown-menu")?.contains(el) && !document.getElementById("dd_color")?.contains(el)) {
        this.dd_color.classList.remove("is-active")
      }
    });
  }

  guardarHorario() {
    if(this.tieneDiasSeleccionados()) {
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
              }, 3000)
              verificado = false;
              break;
            }
          } else {
            if (this.esVacio(pri_entrada) || this.esVacio(pri_salida)) {
              fila.classList.add("animado")
              setTimeout(() => {
                fila.classList.remove("animado")
              }, 3000)
              verificado = false;
              break;
            }
          }
        }
      }
      if (verificado) {
        this.horarioService.crearHorario(JSON.stringify(this.formHorario.value), JSON.stringify(this.formJornadas.value)).subscribe((data: any) => {
          mensaje("Horario creado exitosamente", "is-success")
          this.irAtras()
        }, (error: any) => {
          console.log(error)
        });
      } else {
        mensaje("Debes llenar todos los campos del día", "is-warning")
      }
    } else{
      mensaje("Debes seleccionar al menos un día", "is-warning")
    }
  }

  tieneDiasSeleccionados() {
    let res = false
    for (let dia of this.dias) {
      if (this.getControl(dia + "_habilitado").value) {
        res = true;
        break
      }
    }
    return res;
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

  seleccionarDia(evt: any) {
    let isChecked = (evt).checked
    this.formJornadas.controls[evt.name].setValue(isChecked)
    let id = evt.name.split("_");
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
    this.formHorario.controls.color.setValue(item.color)
    this.dd_color.classList.remove("is-active")
  }

  esVacio(value: string) {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
  }

  onDiasIntercaladosChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked)
      this.formHorario.get('jornadasDosDias')?.setValue(false);
    this.intercalarDias(checked)
  }

  onJornadasDosDiasChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked)
      this.formHorario.get('diasIntercalados')?.setValue(false);
    this.intercalarDias(checked)
  }

  intercalarDias(checked: boolean) {
    for (let dia of this.dias) {
      let check_dia = document.getElementById(dia + "_habilitado") as HTMLInputElement;
      check_dia.checked = checked
      check_dia.disabled = checked
      this.seleccionarDia(check_dia)
      let css_dia = document.getElementById(dia + "_css") as HTMLSpanElement;
      if(checked) {
        this.agregarEstilos(dia, css_dia)
      } else {
        this.quitarEstilos(dia, css_dia)
      }
    }
  }

  agregarEstilos(dia: string, css_dia: HTMLSpanElement) {
    css_dia.classList.remove("es-secundario")
    if(this.dias_impares.includes(dia)) {
      css_dia.classList.add("es-impar")
    } else {
      css_dia.classList.add("es-par")
    }
  }

  quitarEstilos(dia: string, css_dia: HTMLSpanElement) {
    if(this.dias_impares.includes(dia)) {
      css_dia.classList.remove("es-impar")
    } else {
      css_dia.classList.remove("es-par")
    }
    css_dia.classList.add("es-secundario")
  }
}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {Location} from '@angular/common';
import {env} from "../../../../environments/environments";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HorarioService} from "../../../servicios/horario.service";
import {HttpClientModule} from "@angular/common/http";

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
  formAccion:FormGroup|any = new FormGroup({});
  dd_color: any;

  constructor(private modalService: ModalService, private location: Location, public horarioService: HorarioService) {
    let fc_nombre = new FormControl("", [Validators.required, Validators.maxLength(12)])
    let fc_tolerancia = new FormControl("", [Validators.required])
    let fc_color = new FormControl("", [Validators.required])
    let fc_descripcion = new FormControl("", [Validators.required])

    this.formAccion.addControl("nombre", fc_nombre)
    this.formAccion.addControl("tolerancia", fc_tolerancia)
    this.formAccion.addControl("color", fc_color)
    this.formAccion.addControl("descripcion", fc_descripcion)

  }

  ngOnInit() {
    this.dd_color = document.getElementById("dd_color") as HTMLDivElement
    for (let dia of this.dias) {
      new FormControl()
      let res: string[] = []
      res.push(dia + "_pri_entrada")
      res.push(dia + "_pri_salida")
      res.push(dia + "_seg_entrada")
      res.push(dia + "_seg_salida")
      //console.log(res)
      this.formAccion.addControl(dia, new FormControl("", [Validators.required]))
      this.formAccion.addControl(dia + "_pri_entrada", new FormControl("", [Validators.required]))
      this.formAccion.addControl(dia + "_pri_salida", new FormControl("", [Validators.required]))
      this.formAccion.addControl(dia + "_seg_entrada", new FormControl("", [Validators.required]))
      this.formAccion.addControl(dia + "_seg_salida", new FormControl("", [Validators.required]))
    }

  }

  guardarHorario() {
    this.horarioService.crearHorario(JSON.stringify(this.formAccion.value)).subscribe((data:any)=>{
      console.log(data)
    }, (error: any) => {
      console.log(error)
    });
  }

  irAtras() {
    this.location.back();
  }

  get f() {
    return this.formAccion.controls;
  }

  getControl(key: string){
    return this.formAccion.controls[key];
  }

  reset(dia: string) {
    this.formAccion.controls[dia + "_pri_entrada"].reset()
    this.formAccion.controls[dia + "_pri_salida"].reset()
    this.formAccion.controls[dia + "_seg_entrada"].reset()
    this.formAccion.controls[dia + "_seg_salida"].reset()
  }

  changed(evt: any) {
    let isChecked = (<HTMLInputElement>evt.target).checked
    let id = evt.target.name;
    let dia = document.getElementById(id);
    let collection = dia?.getElementsByTagName("td") || []
    for (let i = 0; i < collection.length; i++) {
      if (i != 0) {
        if (isChecked)
          collection[i].classList.remove("desactivado");
        else {
          collection[i].classList.add("desactivado");
          this.reset(id)
        }
      }
    }
  }

  agregarTurno(dia: string) {
    let turno = document.getElementById("turno_" + dia);
    turno?.classList.remove("oculto")
  }

  quitarTurno(dia: string) {
    let turno = document.getElementById("turno_" + dia);
    turno?.classList.add("oculto")
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
    this.dd_color.classList.remove("is-active")
  }

  mostrarForm() {
    console.log(JSON.stringify(this.formAccion.value["lunes_pri_entrada"]))
  }
}

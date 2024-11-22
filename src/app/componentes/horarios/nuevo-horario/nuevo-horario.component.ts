import {Component, OnInit} from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {Location} from '@angular/common';
import {env} from "../../../../environments/environments";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-nuevo-horario',
  standalone: true,
  imports: [],
  templateUrl: './nuevo-horario.component.html',
  styleUrl: './nuevo-horario.component.css'
})
export class NuevoHorarioComponent implements OnInit {
  dias = env.dias.map((dia) => dia.toLowerCase());
  colores = env.colores;
  formAccion = new FormGroup({});
  constructor(private modalService: ModalService, private location: Location) {
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
    for (let dia of this.dias) {
      new FormControl()
      let res: string[] = []
      res.push(dia + "_pri_entrada")
      res.push(dia + "_pri_salida")
      res.push(dia + "_seg_entrada")
      res.push(dia + "_seg_salida")
      console.log(res)
      this.formAccion.addControl(dia + "_pri_entrada", new FormControl("", [Validators.required]))
    }
    console.log(this.formAccion)
  }

  onConfirm() {
    this.modalService.close();
  }

  irAtras() {
    this.location.back();
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
        else
          collection[i].classList.add("desactivado");
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

  saludo() {
    let valor = (document.getElementById("btn_color") as HTMLButtonElement).value
    alert(valor)
  }
}

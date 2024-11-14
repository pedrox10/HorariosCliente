import { Component } from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {Location} from '@angular/common';
import {env} from "../../../../environments/environments";

@Component({
  selector: 'app-nuevo-horario',
  standalone: true,
  imports: [],
  templateUrl: './nuevo-horario.component.html',
  styleUrl: './nuevo-horario.component.css'
})
export class NuevoHorarioComponent {
  dias = env.dias.map((dia) => dia.toLowerCase());

  constructor(private modalService: ModalService, public location: Location) {}

  onConfirm() {
    this.modalService.close();
  }

  irAtras() {
    this.location.back();
  }

  changed(evt: any){
    let isChecked  = (<HTMLInputElement>evt.target).checked
    let id = evt.target.name;
    let dia = document.getElementById(id);
    let collection = dia?.getElementsByTagName("td") || []
    for (let i = 0; i < collection.length; i++) {
      if( i != 0) {
        if(isChecked)
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

  capitalizeFirstLetter() {
    return "a";
  }
}

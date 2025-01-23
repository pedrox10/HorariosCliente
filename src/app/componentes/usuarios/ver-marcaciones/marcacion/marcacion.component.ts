import {Component, Input} from '@angular/core';
import {color} from "../../../inicio/Global";

@Component({
  selector: 'marcacion',
  standalone: true,
  imports: [],
  templateUrl: './marcacion.component.html',
  styleUrl: './marcacion.component.css'
})

export class MarcacionComponent {
  @Input() registros!:string[];
  @Input() tipo!: string;

  constructor() {

  }

  gethora() {
    let res: string;
    if (this.registros != undefined) {
      if (this.registros.length > 1) {
        if (this.tipo === "entrada") {
          res = this.registros[0]
        } else {
          let ult = this.registros.length - 1
          res = this.registros[ult]
        }
      } else {
        res = this.registros[0]
      }
    } else {
      res = "--:--"
    }
    return res;
  }

  getColor(nombre: string){
    return color(nombre)
  }
}



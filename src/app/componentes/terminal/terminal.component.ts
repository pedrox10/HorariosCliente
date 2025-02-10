import { Component, Input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import {Terminal} from "../../modelos/Terminal";
import moment from "moment";
import {color} from "../inicio/Global";

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})

export class  TerminalComponent {
  @Input() terminal!:Terminal;

  constructor() {

  }

  getUltimaSincronizacion () {
    let res=""
    if(this.terminal.ult_sincronizacion)
      res = moment(this.terminal.ult_sincronizacion).format("DD-MM-YYYY HH:mm");
    else
      res = "Nunca"
    return res;
  }

  getColor(nombre: string) {
    return color(nombre)
  }
}

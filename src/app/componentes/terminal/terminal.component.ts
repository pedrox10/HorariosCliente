import { Component, Input, numberAttribute } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Terminal} from "../../modelos/Terminal";
import moment from "moment";
import {color} from "../inicio/Global";
import {env} from "../../../environments/environments";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})

export class  TerminalComponent {
  @Input() terminal!: Terminal;

  constructor(private router: Router) {

  }

  getUltimaSincronizacion() {
    let res = ""
    if (this.terminal.ultSincronizacion)
      res = moment(this.terminal.ultSincronizacion).format("DD/MM/YYYY HH:mm");
    else
      res = "Nunca"
    return res;
  }

  getColor(nombre: string) {
    return color(nombre)
  }

  irA(terminalId: number) {
    env.filtrarEstado = true;
    env.estado = 1;
    env.textoBusqueda = "";
    env.posY = 0;
    env.indexUsuario = -1;
    env.grupo = -1
    this.router.navigateByUrl("/terminal/" + terminalId + "/usuarios");
  }

  getClase() {
    let clase = "help is-primary"
    if (this.terminal.totalMarcaciones > 90000) {
      clase = "help is-danger"
    } else {
      if (this.terminal.totalMarcaciones > 75000)
        clase = "help is-warning"
    }
    return clase;
  }
}

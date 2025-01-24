import {Component, OnInit} from '@angular/core';
import {TerminalService} from "../../../servicios/terminal.service";
import {ModalService} from "ngx-modal-ease";
import {Location} from "@angular/common";
import {HorarioService} from "../../../servicios/horario.service";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {Horario} from "../../../modelos/Horario";
import {Asueto, TipoAsueto} from "../../../modelos/Asueto";
import {Licencia} from "../../../modelos/Licencia";
import moment from "moment";
import {color} from "../../inicio/Global";

@Component({
  selector: 'app-asuetos',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  providers: [HorarioService, TerminalService],
  templateUrl: './asuetos.component.html',
  styleUrl: './asuetos.component.css'
})
export class AsuetosComponent implements OnInit {

  asuetos: Asueto[] = [];
  licencias: Licencia[] = [];

  constructor(public terminalService: TerminalService, public horarioService: HorarioService) {

  }

  ngOnInit() {
    this.horarioService.getAsuetos().subscribe(
      (data: any) => {
        this.asuetos = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );

    this.horarioService.getLicencias().subscribe(
      (data: any) => {
        this.licencias = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getTipo(asueto: Asueto) {
    return TipoAsueto[asueto.tipo]
  }

  formatFecha(asueto: Asueto) {
    return moment(asueto.fecha).format("DD/MM/YYYY")
  }

  getColor(nombre: string) {
    return color(nombre);
  }
}

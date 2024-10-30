import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {TerminalService} from "../../../servicios/terminal.service";
import {TurnoComponent} from "../turno/turno.component";

@Component({
  selector: 'app-ver-horario',
  standalone: true,
  imports: [RouterLink, HttpClientModule, TurnoComponent],
  providers: [TerminalService],
  templateUrl: './ver-horario.component.html',
  styleUrl: './ver-horario.component.css'
})
export class VerHorarioComponent {

}

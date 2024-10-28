import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {TerminalService} from "../../../servicios/terminal.service";
import {TurnoComponent} from "../../horarios/turno/turno.component";

@Component({
  selector: 'app-ver-turnos',
  standalone: true,
  imports: [RouterLink, HttpClientModule, TurnoComponent],
  providers: [TerminalService],
  templateUrl: './ver-turnos.component.html',
  styleUrl: './ver-turnos.component.css'
})
export class VerTurnosComponent {

}

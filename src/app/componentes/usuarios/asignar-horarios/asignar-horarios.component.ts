import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {TerminalService} from "../../../servicios/terminal.service";

@Component({
  selector: 'app-asignar-horarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  providers: [TerminalService],
  templateUrl: './asignar-horarios.component.html',
  styleUrl: './asignar-horarios.component.css'
})
export class AsignarHorariosComponent {

}

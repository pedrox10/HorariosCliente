import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {env} from "../../../../environments/environments";

@Component({
  selector: 'app-turno',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  templateUrl: './turno.component.html',
  styleUrl: './turno.component.css'
})
export class TurnoComponent {
  colores = env.colores;
  constructor() {
  }
}

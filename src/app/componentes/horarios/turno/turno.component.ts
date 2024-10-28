import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-turno',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  templateUrl: './turno.component.html',
  styleUrl: './turno.component.css'
})
export class TurnoComponent {
  constructor() {
  }
}

import { Component, Input, numberAttribute } from '@angular/core';
import { TerminalService } from '../../servicios/terminal.service';
import { RouterLink } from '@angular/router';import {Terminal} from "../../modelos/Terminal";

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
}

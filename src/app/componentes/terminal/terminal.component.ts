import { Component, Input, numberAttribute } from '@angular/core';
import { TerminalService } from '../../servicios/terminal.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})

export class  TerminalComponent {

  @Input() nombre:string;
  @Input() ip:string;
  @Input({
    transform: numberAttribute,
  }) puerto:number;

  constructor() {
    this.nombre = "";
    this.ip = "";
    this.puerto = 0;
  }
}

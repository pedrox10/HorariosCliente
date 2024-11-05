import { Component } from '@angular/core';
import {TerminalService} from "../../../../servicios/terminal.service";
import {FormBuilder} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-accion-terminal',
  standalone: true,
  imports: [HttpClientModule],
  providers: [TerminalService],
  templateUrl: './accion-terminal.component.html',
  styleUrl: './accion-terminal.component.css'
})
export class AccionTerminalComponent {
  terminales = this.terminalService.getTerminales()

  constructor(private terminalService: TerminalService,
              private formBuilder: FormBuilder){

  }
}

import {Component, OnInit} from '@angular/core';
import {TerminalService} from "../../../../servicios/terminal.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import { toast } from 'bulma-toast'

@Component({
  selector: 'app-accion-terminal',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  providers: [TerminalService],
  templateUrl: './accion-terminal.component.html',
  styleUrl: './accion-terminal.component.css'
})

export class AccionTerminalComponent implements OnInit {
  public terminales = this.terminalService.getTerminales()
  formAccion = this.formBuilder.group({nombre: "", ip: "", puerto: ""})
  constructor(private terminalService: TerminalService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    console.log("Formulario enviado", this.formAccion.value)
    toast({
      message: 'Hello There',
      type: 'is-success',
      position: "bottom-center",
      dismissible: true,
      animate: { in: 'fadeIn', out: 'fadeOut' },
    })
    this.terminalService.agregarTerminal(this.formAccion.value).subscribe(
      (data: any) => {
        console.log(data)
      },
      (error: any) => {
          console.error('An error occurred:', error);
      }
    );
    this.formAccion.reset();
  }
}

import {Component, OnInit} from '@angular/core';
import {TerminalService} from "../../../../servicios/terminal.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {toast} from 'bulma-toast'
import {ModalService} from "ngx-modal-ease";

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

  constructor(private terminalService: TerminalService, private formBuilder: FormBuilder, public modalService: ModalService) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.terminalService.agregarTerminal(this.formAccion.value).subscribe(
      (data: any) => {
        console.log(data)
        toast({
          message: 'Terminal Agregado!',
          type: 'is-success',
          position: "bottom-center",
          duration: 4000,
          animate: {in: 'bounceIn', out: 'bounceOut'},
        })
      },
      (error: any) => {
        console.error('An error occurred:', error);
        toast({
          message: 'Error',
          type: 'is-danger',
          position: "bottom-center",
          dismissible: true,
          duration: 5000,
          animate: {in: 'bounceIn', out: 'bounceOut'},
        })
      }
    );
    this.formAccion.reset();
    this.modalService.close();
  }

  cerrarModal(){
    this.modalService.close()
  }
}

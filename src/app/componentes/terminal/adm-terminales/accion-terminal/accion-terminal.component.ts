import {Component, OnInit} from '@angular/core';
import {TerminalService} from "../../../../servicios/terminal.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {toast} from 'bulma-toast'
import {ModalService} from "ngx-modal-ease";
import {AdmTerminalesComponent} from "../adm-terminales.component";
import {Router} from '@angular/router';

@Component({
  selector: 'app-accion-terminal',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  providers: [TerminalService],
  templateUrl: './accion-terminal.component.html',
  styleUrl: './accion-terminal.component.css'
})

export class AccionTerminalComponent implements OnInit {
  formAccion = this.formBuilder.group({nombre: "", ip: "", puerto: ""})
  public accion: string = "";
  id_actual:number = -1;

  constructor(private terminalService: TerminalService,
              private formBuilder: FormBuilder,
              private admTerminales: AdmTerminalesComponent,
              public modalService: ModalService, private router: Router) {
  }

  ngOnInit() {
    this.accion = this.modalService.options?.data !== undefined ? "Editar" : "Agregar";
    if (this.accion == "Editar") {
      let terminal: any = this.modalService.options?.data;
      this.id_actual =  terminal.id;
      this.formAccion.patchValue({
        nombre: terminal.nombre,
        ip: terminal.ip,
        puerto: "4322",
      })
    }
  }

  onSubmit(): void {
    if(this.accion === "Agregar") {
      this.terminalService.agregarTerminal(this.formAccion.value).subscribe(
        (data: any) => {
          this.accionTerminal(data)
        },
        (error: any) => {
          this.accionError(error)
        }
      );
    } else {
      this.terminalService.editarTerminal(this.id_actual, this.formAccion.value).subscribe(
        (data: any) => {
          this.accionTerminal(data)
        },
        (error: any) => {
          this.accionError(error)
        }
      );
    }

  }

  accionTerminal(data: any) {
    let datos = data
    this.modalService.close(datos);
    this.formAccion.reset();
    let mensaje = this.accion == "Agregar" ? "Terminal Agregado" : "Terminal Editado";
    toast({
      message: '<span class="icon" style="min-width: 175px;"><i style="color: white; font-size: 2em; padding-right: 10px" class="fas fa-check"></i>' + mensaje + '</span>',
      type: "is-success",
      position: "bottom-center",
      duration: 4000,
      animate: {in: 'bounceIn', out: 'bounceOut'},
    })
  }

  accionError(error: any) {
    console.error('An error occurred:', error);
    toast({
      message: '<span class="icon"><i style="color: white; font-size: 2em; padding-right: 15px" class="fas fa-delete"></i></span>Ha ocurrido un error',
      type: "is-danger",
      position: "bottom-center",
      duration: 4000,
      animate: {in: 'bounceIn', out: 'bounceOut'},
    })
  }

  onClose() {
    this.modalService.close();
  }
}

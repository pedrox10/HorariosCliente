import {Component, OnInit} from '@angular/core';
import {TerminalService} from "../../../../servicios/terminal.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {toast} from 'bulma-toast'
import {ModalService} from "ngx-modal-ease";
import {AdmTerminalesComponent} from "../adm-terminales.component";
import {Router} from '@angular/router';
import {Terminal} from "../../../../modelos/terminal.model";

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

  constructor(private terminalService: TerminalService,
              private formBuilder: FormBuilder,
              private admTerminales: AdmTerminalesComponent,
              public modalService: ModalService, private router: Router) {
  }

  ngOnInit() {
    this.accion = this.modalService.options?.data !== undefined ? "Editar" : "Agregar";
    if(this.accion == "Editar"){
      let terminal: any = this.modalService.options?.data;
      this.formAccion.patchValue({
        nombre: terminal.nombre,
        ip: terminal.ip,
        puerto: "4322",
      })
    }
  }

  onSubmit(): void {
    let datos;
    this.terminalService.agregarTerminal(this.formAccion.value).subscribe(
      (data: any) => {
        datos = data
        this.modalService.close(datos);
        this.formAccion.reset();
        toast({
          message: '<span class="icon"><i style="color: white; font-size: 2em; padding-right: 15px" class="fas fa-check"></i></span>Terminal Agregado!',
          type: "is-success",
          position: "bottom-center",
          duration: 4000,
          animate: {in: 'bounceIn', out: 'bounceOut'},
        })
      },
      (error: any) => {
        console.error('An error occurred:', error);
        toast({
          message: '<span class="icon"><i style="color: white; font-size: 2em; padding-right: 15px" class="fas fa-delete"></i></span>Ha ocurrido un error',
          type: "is-danger",
          position: "bottom-center",
          duration: 4000,
          animate: {in: 'bounceIn', out: 'bounceOut'},
        })
      }
    );
  }

  onClose() {
    this.modalService.close();
  }
}

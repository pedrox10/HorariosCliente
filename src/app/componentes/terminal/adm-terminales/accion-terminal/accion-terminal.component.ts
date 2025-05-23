import {Component, OnInit} from '@angular/core';
import {TerminalService} from "../../../../servicios/terminal.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {toast} from 'bulma-toast'
import {ModalService} from "ngx-modal-ease";
import {Router} from '@angular/router';
import {CommonModule} from "@angular/common";
import {env} from "../../../../../environments/environments";

@Component({
  selector: 'app-accion-terminal',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  providers: [TerminalService],
  templateUrl: './accion-terminal.component.html',
  styleUrl: './accion-terminal.component.css'
})

export class AccionTerminalComponent implements OnInit {

  public categorias = env.categorias;
  formAccion = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(14)]),
    ip: new FormControl('', [Validators.required, Validators.pattern('(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]),
    puerto: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
    categoria: new FormControl('', [Validators.required]),
    tieneConexion: new FormControl(false)
  });

  public accion: string = "";
  idActual: number = -1;

  constructor(private terminalService: TerminalService,
              public modalService: ModalService, private router: Router) {
  }

  ngOnInit() {
    this.accion = this.modalService.options?.data !== undefined ? "Editar" : "Agregar";
    if (this.accion == "Editar") {
      let terminal: any = this.modalService.options?.data;
      this.idActual = terminal.id;
      this.formAccion.patchValue({
        nombre: terminal.nombre,
        ip: terminal.ip,
        puerto: terminal.puerto,
        categoria: terminal.categoria,
        tieneConexion: terminal.tieneConexion
      })
    }
  }

  onSubmit(): void {
    console.log(this.formAccion.value)
    if (this.accion === "Agregar") {
      this.terminalService.agregarTerminal(this.formAccion.value).subscribe(
        (data: any) => {
          this.accionTerminal(data)
        },
        (error: any) => {
          this.accionError(error)
        }
      );
    } else {
      this.terminalService.editarTerminal(this.idActual, this.formAccion.value).subscribe(
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
      message: '<span class="icon" style="min-width: 175px;"><i style="color: white; font-size: 1.5em; padding-right: 10px" class="fas fa-check"></i>' + mensaje + '</span>',
      type: "is-success",
      position: "bottom-center",
      duration: 3000,
      animate: {in: 'backInUp', out: 'backOutDown'},
      extraClasses: "bordes-redondeados"
    })
  }

  accionError(error: any) {
    console.error('An error occurred:', error);
    toast({
      message: '<span class="icon"><i style="color: white; font-size: 2em; padding-right: 15px" class="fas fa-delete"></i></span>Ha ocurrido un error',
      type: "is-danger",
      position: "bottom-center",
      duration: 3000,
      animate: {in: 'bounceIn', out: 'bounceOut'},
    })
  }

  cerrarModal() {
    this.modalService.close();
  }

  get f() {
    return this.formAccion.controls;
  }

  cambio(ev: any) {
    let texto = ev.target.value.trim();
    let str = texto.split(" ").filter((c: string) => c !== "")
    let res = str.join(" ")
    this.f["nombre"].setValue(res)
  }
}

import {AfterViewInit, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TerminalService} from "../../../servicios/terminal.service";
import {ModalService} from "ngx-modal-ease";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import moment from "moment";
import {Usuario} from "../../../modelos/Usuario";
import {color, mensaje} from "../../inicio/Global";
import {env} from "../../../../environments/environments";
import {Terminal} from "../../../modelos/Terminal";
import {UsuarioService} from "../../../servicios/usuario.service";
import {AuthService} from "../../../servicios/auth.service";

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  providers: [TerminalService],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css'
})

export class EditarUsuarioComponent implements AfterViewInit {
  formAccion = new FormGroup({
    // --- Form editar ---
    fechaAlta: new FormControl(''),
    fechaBaja: new FormControl(''),
    estado: new FormControl(''),
    fechaCumpleano: new FormControl(''),
    // --- Form editar_en_biometrico ---
    nombre: new FormControl(''),
    privilegio: new FormControl(''),
    confirmarEdicion: new FormControl(false),
    // --- Form clonar ---
    confirmarClonacion: new FormControl(false)
  });
  gestionActual: number = 0;
  public usuario: Usuario|any;
  public id: number | any;
  public categorias = env.categorias;
  public terminales: Terminal[] = [];
  public terminalesFiltrados: Terminal[] = [];
  formActual: "editar" | "editar_en_biometrico" | "clonar" = "editar";
  terminalSeleccionado: any = null;
  isSuperadmin: boolean;

  constructor(private terminalService: TerminalService, private usuarioService: UsuarioService,
              public modalService: ModalService, private authService: AuthService) {
    this.isSuperadmin  = this.authService.tieneRol('Superadmin');
    let data: any = this.modalService.options?.data
    if (data) {
      this.id = data.id;
    }

    this.usuarioService.getUsuario(this.id).subscribe(
      (data: any) => {
        this.usuario = data;
        this.formAccion.controls.fechaAlta.setValue(this.usuario.fechaAlta)
        this.formAccion.controls.fechaBaja.setValue(this.usuario.fechaBaja)
        this.formAccion.controls.fechaCumpleano.setValue(this.usuario.fechaCumpleano)
        this.formAccion.controls.estado.setValue(this.usuario.estado)
      })
    this.gestionActual = moment().year()
  }

  ngOnInit(): void {
    this.getTerminales()
  }

  getTerminales() {
    this.terminalService.getTerminales().subscribe(
      (data: any) => {
        this.terminales = data;
        console.log(this.terminales)
        this.terminalesFiltrados = this.terminales.slice();
        this.filtrarPorCategoria(0)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  filtrarPorCategoria(index: number) {
    this.terminalesFiltrados = this.terminales.filter(t => t.categoria === index);
    env.posCategoria = index;
  }

  ngAfterViewInit() {

  }

  onSubmit(): void {
    switch (this.formActual) {
      case 'editar':
        let fechaBaja = this.formAccion.controls.fechaBaja.value;
        if(fechaBaja) {
          let fechaAlta = this.formAccion.controls.fechaAlta.value;
          if(moment(fechaBaja).isBefore(moment(fechaAlta)) || moment(fechaBaja).isSame(moment(fechaAlta))) {
            document.getElementById("fecha_baja")?.classList.add("is-danger");
            mensaje("¡Fecha de baja no puede ser menor o igual a la de alta!", "is-warning")
            setTimeout(() => {
              document.getElementById("fecha_baja")?.classList.remove("is-danger");
            }, 3000);
          } else {
            this.editarUsuario()
          }
        } else {
          this.editarUsuario()
        }
        break;

      case 'editar_en_biometrico':
        console.log(this.formActual)
        break;

      case 'clonar':
        this.clonarUsuario(this.usuario.id, this.usuario.terminal.id, this.terminalSeleccionado.id)
        break;
    }
  }

  editarUsuario() {
    this.usuarioService.editarUsuario(this.usuario.id, this.formAccion.value).subscribe(
      (data: any) => {
        this.modalService.close(data);
        this.formAccion.reset();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  editarEnBiometrico() {
    /*this.usuarioService.editarEnBiometrico(this.usuario.id, this.formAccion.value).subscribe(
      (data: any) => {
        this.modalService.close(data);
        this.formAccion.reset();
      },
      (error: any) => {
        console.log(error)
      }
    );*/
  }

  clonarUsuario(idUsuario: number, idOrigen: number, idDestino: number) {
    this.usuarioService.clonarUsuario(idUsuario, idOrigen, idDestino).subscribe(
      (data: any) => {
        this.modalService.close(data);
        this.formAccion.reset();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  mostrarEditar() {
    this.formActual = "editar"
  }

  mostrarEditarEnBiometrico() {
    this.formActual = "editar_en_biometrico"
  }

  mostrarClonar() {
    this.formActual = "clonar"
  }

  isSelected(index: number): boolean {
    return env.posCategoria === index;
  }

  seleccionarTerminal(terminal: any) {
    this.terminalSeleccionado =
      this.terminalSeleccionado === terminal ? null : terminal;
  }

  esFormularioValido(): boolean {
    switch (this.formActual) {
      case 'editar':
        return !!this.formAccion.get('fechaAlta')?.value;

      case 'editar_en_biometrico':
        let nombre = this.formAccion.get('nombre')?.value?.trim();
        let confirmarEdicionMarcado = this.formAccion.get('confirmarEdicion')?.value;
        return !!nombre && !!confirmarEdicionMarcado;

      case 'clonar':
        let confirmarClonacionMarcado = this.formAccion.get('confirmarClonacion')?.value;
        return this.terminalSeleccionado && confirmarClonacionMarcado;

        default:
        return false;
    }
  }

  cerrarModal() {
    this.modalService.close();
  }

  getColor(nombre: string) {
    return color(nombre)
  }
}

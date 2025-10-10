import {AfterViewInit, Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TerminalService} from "../../../servicios/terminal.service";
import {ModalService} from "ngx-modal-ease";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {easepick} from "@easepick/core";
import moment from "moment";
import {Usuario} from "../../../modelos/Usuario";
import {color, mensaje} from "../../inicio/Global";
import {env} from "../../../../environments/environments";
import {Terminal} from "../../../modelos/Terminal";

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
    fechaAlta: new FormControl('', [Validators.required]),
    fechaBaja: new FormControl('', []),
    estado: new FormControl('', []),
    fechaCumpleano: new FormControl('', []),
  });

  gestionActual: number = 0;
  public usuario: Usuario|any;
  public id: number | any;

  public categorias = env.categorias;
  public terminales: Terminal[] = [];
  public terminalesFiltrados: Terminal[] = [];
  terminalSeleccionado: any = null;

  constructor(private terminalService: TerminalService, public modalService: ModalService) {
    let data: any = this.modalService.options?.data
    if (data) {
      this.id = data.id;
    }

    this.terminalService.getUsuario(this.id).subscribe(
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
        console.log(this.formAccion.value)
        this.editarUsuario()
      }
    } else {
      console.log(this.formAccion.value)
      this.editarUsuario()
    }
  }

  editarUsuario() {
    this.terminalService.editarUsuario(this.usuario.id, this.formAccion.value).subscribe(
      (data: any) => {
        this.modalService.close(data);
        this.formAccion.reset();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  mostrarEditarEnBiometrico() {
    document.getElementById("editar_en_biometrico")?.classList.add("active");
    document.getElementById("editar")?.classList.remove("active");
    document.getElementById("clonar")?.classList.remove("active");
  }

  mostrarClonar() {
    document.getElementById("clonar")?.classList.add("active");
    document.getElementById("editar")?.classList.remove("active");
    document.getElementById("editar_en_biometrico")?.classList.remove("active");
  }

  isSelected(index: number): boolean {
    return env.posCategoria === index;
  }

  seleccionarTerminal(terminal: any) {
    // Si se vuelve a hacer clic sobre el mismo, se deselecciona
    this.terminalSeleccionado =
      this.terminalSeleccionado === terminal ? null : terminal;
  }

  cerrarModal() {
    this.modalService.close();
  }

  getColor(nombre: string) {
    return color(nombre)
  }
}

import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {HorarioService} from "../../../servicios/horario.service";
import {ModalService} from "ngx-modal-ease";
import {Horario} from "../../../modelos/Horario";
import {EditarUsuarioComponent} from "../../usuarios/editar-usuario/editar-usuario.component";
import {env} from "../../../../environments/environments";
import {color} from "../../inicio/Global";
import {toast} from "bulma-toast";

@Component({
  selector: 'app-editar-horario',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  providers: [HorarioService],
  templateUrl: './editar-horario.component.html',
  styleUrl: './editar-horario.component.css'
})
export class EditarHorarioComponent {
  formHorario: FormGroup | any = new FormGroup({});
  colores: any = env.colores;
  dd_color: any;
  public horario: Horario|any;
  public id: number | any;

  constructor(private modalService: ModalService, public horarioService: HorarioService) {

    let fc_nombre = new FormControl("", [Validators.required, Validators.maxLength(14)])
    let fc_tolerancia = new FormControl("5", [Validators.required])
    let fc_color = new FormControl("", [Validators.required])
    let fc_area = new FormControl("Central", [Validators.required])
    let fc_descripcion = new FormControl("", [])

    this.formHorario.addControl("nombre", fc_nombre)
    this.formHorario.addControl("tolerancia", fc_tolerancia)
    this.formHorario.addControl("color", fc_color)
    this.formHorario.addControl("area", fc_area)
    this.formHorario.addControl("descripcion", fc_descripcion)

    let data: any = this.modalService.options?.data
    if (data) {
      this.id = data.id;
    }

    this.horarioService.getHorario(this.id).subscribe(
      (data: any) => {
        this.horario = data;
        fc_nombre.setValue(this.horario.nombre)
        fc_tolerancia.setValue(this.horario.tolerancia)
        let boton = document.getElementById("btn_color") as HTMLButtonElement;
        let texto = document.getElementById("txt_color") as HTMLSpanElement;
        texto.textContent = this.horario.color
        boton.style.backgroundColor = this.getColor(this.horario.color)
        fc_color.setValue(this.horario.color)
        console.log(fc_color.value)
        fc_area.setValue(this.horario.area)
        fc_descripcion.setValue(this.horario.descripcion)
      })

  }

  ngOnInit() {
    this.dd_color = document.getElementById("dd_color") as HTMLDivElement
    document.addEventListener('click', (event) => {
      let el = (event.target) as HTMLElement;
      if (!document.getElementById("dropdown-menu")?.contains(el) && !document.getElementById("dd_color")?.contains(el)) {
        this.dd_color.classList.remove("is-active")
      }
    });
  }

  get f() {
    return this.formHorario.controls;
  }

  mostrarColores(evt: any) {
    let boton = evt.target as HTMLButtonElement;
    if (this.dd_color.classList.contains("is-active")) {
      this.dd_color.classList.remove("is-active")
    } else {
      this.dd_color.classList.add("is-active")
    }
  }

  seleccionarColor(item: any) {
    let boton = document.getElementById("btn_color") as HTMLButtonElement;
    let texto = document.getElementById("txt_color") as HTMLSpanElement;
    texto.textContent = item.color
    boton.style.backgroundColor = item.valor
    this.formHorario.controls.color.setValue(item.color)
    console.log(this.formHorario.controls.color.value)
    this.dd_color.classList.remove("is-active")
  }

  getColor(nombre: string) {
    return color(nombre);
  }

  editarHorario() {
    this.horarioService.editarHorario(this.id, this.formHorario.value).subscribe(
      (data: any) => {
        let datos = data
        this.modalService.close(datos);
        let mensaje = "Horario Editado";
        toast({
          message: '<span class="icon" style="min-width: 175px;"><i style="color: white; font-size: 1.5em; padding-right: 10px" class="fas fa-check"></i>' + mensaje + '</span>',
          type: "is-success",
          position: "bottom-center",
          duration: 3000,
          animate: {in: 'backInUp', out: 'backOutDown'},
          extraClasses: "bordes-redondeados"
        })
      },
      (error: any) => {
        console.error('An error occurred:', error);
        toast({
          message: '<span class="icon"><i style="color: white; font-size: 2em; padding-right: 15px" class="fas fa-delete"></i></span>Ha ocurrido un error',
          type: "is-danger",
          position: "bottom-center",
          duration: 3000,
          animate: {in: 'bounceIn', out: 'bounceOut'},
        })
      }
    );
  }

  cerrarModal() {
    this.modalService.close();
  }
}

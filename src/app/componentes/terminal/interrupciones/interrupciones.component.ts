import {Component, inject} from '@angular/core';
import {Location} from "@angular/common";
import {Interrupcion} from "../../../modelos/Interrupcion";
import {ModalService} from "ngx-modal-ease";
import {AgregarInterrupcionComponent} from "./agregar-interrupcion/agregar-interrupcion.component";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TerminalService} from "../../../servicios/terminal.service";
import moment from "moment";
import {Terminal} from "../../../modelos/Terminal";
import {mensaje} from "../../inicio/Global";

@Component({
  selector: 'app-interrupciones',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterLink],
  providers: [TerminalService],
  templateUrl: './interrupciones.component.html',
  styleUrl: './interrupciones.component.css'
})

export class InterrupcionesComponent {

  private activatedRoute = inject(ActivatedRoute);
  public idTerminal = this.activatedRoute.snapshot.params['id'];
  public interrupciones: Interrupcion[] = [];
  idActual: number = -1;

  constructor(private location: Location, private modalService: ModalService, private terminalService: TerminalService ) {

  }

  ngOnInit(): void {
    this.getInterrupciones()
    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        this.ocultarEliminar()
      }
    });
    document.getElementById("fondo_eliminar")?.addEventListener("click", (e) => {
      this.ocultarEliminar()
    })
  }

  getInterrupciones() {
    this.terminalService.getInterrupciones(this.idTerminal).subscribe(
      (data: any) => {
        this.interrupciones = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  agregarInterrupcionModal() {
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear'};
    this.modalService
      .open(AgregarInterrupcionComponent, {
        modal: {enter: `${config.animation} ${config.duration}`,},
        size: {padding: '0.5rem'},
        overlay: {backgroundColor: "rgba(0, 0, 0, 0.65)"},
        data: this.idTerminal
      })
      .subscribe((data) => {
        if(data !== undefined)
          this.add(data)
      });
  }

  eliminarInterrupcionModal(interrupcion: Interrupcion) {
    document.getElementById("eliminar_modal")?.classList.add("is-active");
    this.idActual = interrupcion.id;
  }

  eliminarInterrupcion() {
    this.terminalService.eliminarInterrupcion(this.idActual).subscribe(
      (data: any) => {
        const index = this.interrupciones.map(i => i.id).indexOf(this.idActual);
        this.interrupciones.splice(index, 1);
        this.ocultarEliminar()
        mensaje("Interrupción eliminada correctamente", "is-success")
      },
      (error: any) => {
        console.error('An error occurred:', error);
        mensaje("No se pudo eliminar el registro", "is-danger")
      }
    )
  }

  ocultarEliminar() {
    document.getElementById("eliminar_modal")?.classList.remove("is-active");
  }

  add(interrupcion: Interrupcion) {
    this.interrupciones.push(interrupcion)
  }

  formatearFecha(fecha: Date) {
    return moment(fecha).format("DD/MM/YYYY")
  }

  formatearHora(hora: Date) {
    return moment(hora).format("HH:mm")
  }

  irAtras() {
    this.location.back();
  }
}

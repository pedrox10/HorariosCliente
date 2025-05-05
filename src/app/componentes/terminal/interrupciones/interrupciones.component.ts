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

  constructor(private location: Location, private modalService: ModalService, private terminalService: TerminalService ) {

  }

  ngOnInit(): void {
    this.getInterrupciones()
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
      })
      .subscribe((data) => {
        if(data !== undefined)
          this.add(data)
      });
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

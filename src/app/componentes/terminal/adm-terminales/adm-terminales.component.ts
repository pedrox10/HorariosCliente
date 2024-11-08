import {Component, Injectable} from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {AccionTerminalComponent} from "./accion-terminal/accion-terminal.component";
import {TerminalService} from "../../../servicios/terminal.service";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {Terminal} from "../../../modelos/terminal.model";

@Component({
  selector: 'app-adm-terminales',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  providers: [TerminalService],
  templateUrl: './adm-terminales.component.html',
  styleUrl: './adm-terminales.component.css'
})

@Injectable({
  providedIn: 'root'
})
export class AdmTerminalesComponent {

  public terminales: Terminal[] = [];

  constructor(public terminalService: TerminalService, private modalService: ModalService) {
    this.terminalService.getTerminales().subscribe(
      (data: any) => {
        this.terminales = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  nuevoTerminal() {
    let config = { animation: 'enter-scaling', duration: '0.2s', easing: 'linear',};
    this.modalService
      .open(AccionTerminalComponent, {
        modal: { enter: `${config.animation} ${config.duration}`,},
        size: { padding: '0.5rem', width: '200px'},
        data: {
          accion: 'Agregar',
        },
      })
      .subscribe((data) => {
        console.log(data || '')
      });

  }
}

import {Component, Injectable, OnInit} from '@angular/core';
import {ModalService} from "ngx-modal-ease";
import {AccionTerminalComponent} from "./accion-terminal/accion-terminal.component";
import {TerminalService} from "../../../servicios/terminal.service";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {Terminal} from "../../../modelos/terminal.model";
import { Router } from '@angular/router';

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
export class AdmTerminalesComponent implements OnInit {

  public terminales: Terminal[] = [];

  constructor(public terminalService: TerminalService, private modalService: ModalService, private router: Router) {

  }

  ngOnInit() {
    this.getTerminales()
    //window.location.reload()
  }
  add(terminal:Terminal) {
    if(terminal !== undefined)
      this.terminales.push(terminal);
  }

  edit(terminal:Terminal) {
    this.terminales.at(0)!.nombre = "Cambiado"
  }

  getTerminales() {
    this.terminalService.getTerminales().subscribe(
      (data: any) => {
        this.terminales = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  abrirModal(data:any) {
    let config = {animation: 'enter-scaling', duration: '0.2s', easing: 'linear',};
    let ref = this.modalService
      .open(AccionTerminalComponent, {
        modal: {enter: `${config.animation} ${config.duration}`,},
        size: {padding: '0.5rem', width: '200px'},
        data: data
      })
      .subscribe((data) => {
        this.edit(data)
      });

  }

  refrescar(){
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/adm-terminales').then(() => {
      window.location.reload()
    });
  }
}

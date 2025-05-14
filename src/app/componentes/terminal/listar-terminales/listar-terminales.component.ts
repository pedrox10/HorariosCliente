import {Component, OnInit} from '@angular/core';
import { TerminalComponent } from '../terminal.component';
import { TerminalService } from '../../../servicios/terminal.service';
import { HttpClientModule } from '@angular/common/http';
import {Location} from '@angular/common';
import {Terminal} from "../../../modelos/Terminal";
import {color} from "../../inicio/Global";
import {env} from "../../../../environments/environments";

@Component({
  selector: 'app-listar-terminales',
  standalone: true,
  imports: [TerminalComponent, HttpClientModule],
  providers: [TerminalService],
  templateUrl: './listar-terminales.component.html',
  styleUrl: './listar-terminales.component.css'
})

export class ListarTerminalesComponent implements OnInit{
  public terminales: Terminal[] = [];
  public terminalesFiltrados: Terminal[] = [];
  public element = document.getElementById("terminales");
  public constructor(public terminalService: TerminalService, public location: Location) {

  }

  ngOnInit(): void {
    this.getTerminales()
  }

  getTerminales() {
    this.terminalService.getTerminales().subscribe(
      (data: any) => {
        this.terminales = data;
        this.terminalesFiltrados = data
        this.filtrarPorCategoria(env.categoria)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  buscar(texto: string) {
    const lower = texto.toLowerCase();
    this.terminalesFiltrados = this.terminales.filter(t =>
      t.nombre.toLowerCase().includes(lower) ||
      t.ip.toLowerCase().includes(lower)
    );
  }

  filtrarPorCategoria(categoria: string) {
    this.terminalesFiltrados = this.terminales.filter(t => t.categoria === categoria);
    if(env.categoria !== categoria)
      env.categoria = categoria;
  }

  getColor(nombre: string) {
    return color(nombre)
  }

  isSelected(categoria: string): boolean {
    return env.categoria === categoria;
  }
}

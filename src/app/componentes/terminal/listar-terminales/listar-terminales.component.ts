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
  public categorias = env.categorias;
  mostrarNotificaciones = false;
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
        console.log(this.terminales)
        this.terminalesFiltrados = this.terminales.slice();
        this.filtrarPorCategoria(env.posCategoria)
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

  filtrarPorCategoria(index: number) {
    this.terminalesFiltrados = this.terminales.filter(t => t.categoria === index);
    env.posCategoria = index;
  }

  getColor(nombre: string) {
    return color(nombre)
  }

  isSelected(index: number): boolean {
    return env.posCategoria === index;
  }

  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
  }
}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TerminalService} from "../../../servicios/terminal.service";
import {HorarioService} from "../../../servicios/horario.service";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {Asueto, TipoAsueto} from "../../../modelos/Asueto";
import {Licencia} from "../../../modelos/Licencia";
import moment from "moment";
import {color, mensaje} from "../../inicio/Global";
import {easepick} from "@easepick/core";
import {AuthService} from "../../../servicios/auth.service";

@Component({
  selector: 'app-asuetos',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, FormsModule, RouterLink],
  providers: [HorarioService, TerminalService],
  templateUrl: './asuetos.component.html',
  styleUrl: './asuetos.component.css'
})
export class AsuetosComponent implements OnInit, AfterViewInit {

  asuetos: Asueto[] = [];
  asuetosFiltrados: Asueto[] = [];
  gestiones: number[] = [];
  gestionSeleccionada!: number;
  idActual: number = -1;
  picker: HTMLInputElement | any = undefined;
  isAdmin: boolean;

  constructor(public terminalService: TerminalService, public horarioService: HorarioService,
              public authService: AuthService) {
    this.isAdmin  = this.authService.tieneRol('Administrador', 'Superadmin');
  }

  ngOnInit() {
    this.horarioService.getAsuetos().subscribe(
      (data: any) => {
        this.asuetos = data;
        // Gestiones únicas desde BD
        this.gestiones = [...new Set(
          this.asuetos.map(a => a.gestion)
        )].sort((a, b) => b - a);
        // Gestión actual del sistema
        const gestionActual = new Date().getFullYear();
        // Seleccionar la actual si existe, sino la más reciente
        this.gestionSeleccionada =
          this.gestiones.includes(gestionActual)
            ? gestionActual
            : this.gestiones[0];
        console.log(this.gestiones)
        this.filtrarPorGestion();
      },
      error => console.error(error)
    );

    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape') {
        this.ocultarModal()
      }
    });
    document.getElementById("background")?.addEventListener("click", (e) => {
      this.ocultarModal()
    })

  }

  ngAfterViewInit() {
    this.picker = new easepick.create({
      element: document.getElementById('picker_fecha')!,
      inline: true,
      lang: 'es-ES',
      format: "DD/MM/YYYY",
      zIndex: 10,
      css: [
        '../../../assets/easepick_small.css',
      ],
    });
  }

  getTipo(asueto: Asueto) {
    return TipoAsueto[asueto.tipo]
  }

  formatFecha(asueto: Asueto) {
    return moment(asueto.fecha).format("DD/MM/YYYY")
  }

  getColor(nombre: string) {
    return color(nombre);
  }

  ocultarModal() {
    document.getElementById("fecha_modal")?.classList.remove("is-active");
  }

  mostrarModal(asueto: Asueto) {
    document.getElementById("fecha_modal")?.classList.add("is-active");
    this.idActual = asueto.id!;
    if (asueto.fecha) {
      this.picker.setDate(moment(asueto.fecha).toDate())
      this.picker.gotoDate(moment(asueto.fecha).toDate())
    } else {
      this.picker.setDate(null);
      this.picker.gotoDate(null)
    }
    document.getElementById("nombre_feriado")!.innerText = asueto.nombre;
  }

  editarFecha() {
    let nuevaFecha = this.picker.getDate().format('YYYYMMDD')
    this.horarioService.editarFechaAsueto(this.idActual, nuevaFecha).subscribe(
      (asueto: any) => {
        let index = this.asuetosFiltrados.map(i => i.id).indexOf(asueto.id);
        this.asuetosFiltrados[index] = asueto;
        mensaje("¡Fecha seleccionada modificada correctamente!", "is-success")
        this.ocultarModal()
      },
      (error: any) => {
        console.error('An error occurred:', error);
        mensaje("¡No se pudo modificar la fecha seleccionada!", "is-danger")
      }
    );
  }

  filtrarPorGestion() {
    const gestion = Number(this.gestionSeleccionada);
    this.asuetosFiltrados = this.asuetos.filter(a =>
      a.gestion === gestion
    );
  }
}

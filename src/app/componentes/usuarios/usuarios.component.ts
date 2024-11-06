import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TerminalService } from '../../servicios/terminal.service';
import { HttpClientModule } from '@angular/common/http';
import { env } from '../../../environments/environments';
import {TurnoComponent} from "../horarios/turno/turno.component";
import {Location} from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule, TurnoComponent],
  providers: [TerminalService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent {
  public meses = env.meses;
  public usuariosFiltrados: any;
  public usuarios: any = [];
  public registros: any = [];
  private activatedRoute = inject(ActivatedRoute);
  public ip = this.activatedRoute.snapshot.params['ip'];
  public puerto = this.activatedRoute.snapshot.params['puerto'];

  constructor(public terminalService: TerminalService, public location:Location) {
    this.terminalService.getUsuarios(this.ip, this.puerto).subscribe(
      (data: any) => {
        this.usuariosFiltrados = data;
        this.usuarios = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );

    let gestion = this.activatedRoute.snapshot.params['gestion'];
    let mes = this.activatedRoute.snapshot.params['mes'];
  }

  applyFilter($event: any) {
    let texto = $event.target.value.toLowerCase();
    if (texto === "") {
      this.usuariosFiltrados = this.usuarios;
    }
    else {
      this.usuariosFiltrados = this.usuarios.filter((item: any) => item.name.toLowerCase().includes(texto) || item.user_id.includes(texto))
    }
  }

  irAtras() {
    this.location.back();
  }
}

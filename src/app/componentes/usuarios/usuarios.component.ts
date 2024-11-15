import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TerminalService } from '../../servicios/terminal.service';
import { HttpClientModule } from '@angular/common/http';
import { env } from '../../../environments/environments';
import {TurnoComponent} from "../horarios/turno/turno.component";
import {Location} from '@angular/common';
import {Usuario} from "../../modelos/usuario.model";

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
  public usuariosFiltrados: Usuario[] = [];
  public usuarios: Usuario[] = [];
  public registros: any = [];
  private activatedRoute = inject(ActivatedRoute);
  public ip = this.activatedRoute.snapshot.params['ip'];
  public puerto = this.activatedRoute.snapshot.params['puerto'];

  constructor(public terminalService: TerminalService, public location:Location) {
    this.terminalService.getUsuarios(this.ip, this.puerto).subscribe(
      (data: any) => {
        data.forEach((user: any) => {
          let usuario: Usuario = new Usuario(1, user.user_id, user.name, "", "");
          this.usuarios.push(usuario);
          this.usuariosFiltrados.push(usuario);
        });
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
      console.log(this.usuarios)
      console.log(this.usuariosFiltrados)
    }
    else {
      this.usuariosFiltrados = this.usuarios.filter((item: Usuario) => item.nombre.toLowerCase().includes(texto) || item.ci.toString().includes(texto))
    }
  }

  aplicarTodos(ev:any) {
    let esSeleccionado  = (<HTMLInputElement>ev.target).checked
    this.usuariosFiltrados.map((usuario) => {
      if(esSeleccionado)
        usuario.seleccionado = true
      else
        usuario.seleccionado = false
    })
  }

  irAtras() {
    this.location.back();
  }
}

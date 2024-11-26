import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TerminalService} from '../../servicios/terminal.service';
import {HttpClientModule} from '@angular/common/http';
import {env} from '../../../environments/environments';
import {TurnoComponent} from "../horarios/turno/turno.component";
import {Location} from '@angular/common';
import {Usuario} from "../../modelos/usuario.model";
import {delay} from "rxjs";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, HttpClientModule, TurnoComponent],
  providers: [TerminalService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent {
  public colores = env.colores;
  public usuariosFiltrados: Usuario[] = [];
  public usuariosSeleccionados: Usuario[] = [];
  public usuarios: Usuario[] = [];
  private activatedRoute = inject(ActivatedRoute);
  public ip = this.activatedRoute.snapshot.params['ip'];
  public puerto = this.activatedRoute.snapshot.params['puerto'];

  constructor(public terminalService: TerminalService, public location: Location) {
    this.terminalService.getUsuarios(this.ip, this.puerto).subscribe(
      (data: any) => {
        data.forEach((user: any) => {
          let usuario: Usuario = new Usuario(user.user_id, user.name);
          this.usuarios.push(usuario);
          this.usuariosFiltrados.push(usuario);
        });
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  applyFilter($event: any) {
    let texto = $event.target.value.toLowerCase();
    if (texto === "") {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter((item: Usuario) => item.nombre.toLowerCase().includes(texto) || item.ci.toString().includes(texto))
    }
  }

  seleccionar(usuario: Usuario) {
    let cb_todos = (document.getElementById("cb_todos") as HTMLInputElement);
    usuario.seleccionado = !usuario.seleccionado;
    if (usuario.seleccionado)
      this.usuariosSeleccionados.push(usuario)
    else {
      const index = this.usuariosSeleccionados.map(u => u.ci).indexOf(usuario.ci);
      this.usuariosSeleccionados.splice(index, 1);
    }
    if (this.usuariosSeleccionados.length == this.usuarios.length) {
      cb_todos.classList.remove("is-indeterminate");
      cb_todos.checked = true;
    } else {
      if (this.usuariosSeleccionados.length == 0) {
        cb_todos.classList.remove("is-indeterminate");
        cb_todos.checked = false;
      } else {
        cb_todos.classList.add("is-indeterminate");
      }
    }
  }

  aplicarTodos(ev: any) {
    (document.getElementById("cb_todos") as HTMLInputElement).classList.remove("is-indeterminate");
    let esSeleccionado = (<HTMLInputElement>ev.target).checked
    this.usuariosFiltrados.map((usuario) => {
      if (esSeleccionado)
        usuario.seleccionado = true
      else
        usuario.seleccionado = false
    })
    if (esSeleccionado)
      this.usuariosSeleccionados = this.usuariosFiltrados.slice();
    else
      this.usuariosSeleccionados = []
  }

  sincronizar(){
    document.getElementById("btn_sincronizar")?.classList.add("is-loading");
    this.terminalService.getMarcaciones(this.ip, this.puerto).subscribe(
      (data: any) => {
        console.log(data)
        setTimeout(() => {
          document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
        }, 1000);

      },
      (error: any) => {
        console.error('An error occurred:', error);
        document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
      }
    );
  }

  irAtras() {
    this.location.back();
  }
}

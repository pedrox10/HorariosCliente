import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TerminalService } from '../../servicios/terminal.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-resumen-mensual',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  providers: [TerminalService],
  templateUrl: './resumen-mensual.component.html',
  styleUrl: './resumen-mensual.component.css'
})
export class ResumenMensualComponent {
  public usuariosFiltrados: any;
  public usuarios: any = [];
  public registros: any = [];
  private activatedRoute = inject(ActivatedRoute);

  constructor(public terminalService: TerminalService) {
    let ip = this.activatedRoute.snapshot.params['ip'];
    let puerto = this.activatedRoute.snapshot.params['puerto'];
    this.terminalService.getUsuarios(ip, puerto).subscribe(
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
    /*this.terminalService.getRegistrosTiempo(gestion, mes).subscribe(
      (data: any) => {
        this.registros = data;
        console.log(data)
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );*/
  }

  applyFilter($event: any) {
    let texto = $event.target.value.toLowerCase();
    if (texto === "") {
      this.usuariosFiltrados = this.usuarios;
    }
    else {
      this.usuariosFiltrados = this.usuarios.filter((item: any) => item.name.toLowerCase().includes(texto))
    }
  }
}
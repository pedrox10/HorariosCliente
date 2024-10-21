import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { env } from '../../../environments/environments';
import { TerminalService } from '../../servicios/terminal.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-resumen-usuario',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  providers: [TerminalService],
  templateUrl: './resumen-usuario.component.html',
  styleUrl: './resumen-usuario.component.css'
})

export class ResumenUsuarioComponent {
  public gestion: number = 2024
  public mesActual: number = 7;
  public numDias: number;
  public dias: string[] = [];
  private res: string = "";
  private activatedRoute = inject(ActivatedRoute);
  public ip = this.activatedRoute.snapshot.params['ip'];
  public puerto = this.activatedRoute.snapshot.params['puerto'];
  public nombre = this.activatedRoute.snapshot.params['nombre'];
  public meses = env.meses;
  public feb: string[] = [];

  constructor(public terminalService: TerminalService) {
    this.terminalService.getMarcaciones(this.ip, this.puerto).subscribe(
      (data: any) => {
        const aux = data;
        let cad = this.gestion + "-10-";
        let re_fecha = new RegExp(cad + '(.*)');
        let re_ci = new RegExp(this.nombre);
        aux.forEach((value: any) => {
          if (re_fecha.test(value.timestamp) && re_ci.test(value.user_id)) {
            this.feb.push(value);
          }
        });
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
    this.numDias = this.getNumDias(this.mesActual, this.gestion);
    for (var i = 1; i <= this.numDias; i++) {
      this.dias.push(this.getNombreDia(i).substring(0, 3) + " " + i);
    }
    console.log(this.feb);
  }

  getNumDias(mes: number, gestion: number) {
    return new Date(gestion, mes, 0).getDate();
  }

  getNombreDia(dia: number) {
    const fecha = new Date(this.gestion, this.mesActual, dia);
    const day = fecha.getDay();
    return env.dias[day];
  }
}

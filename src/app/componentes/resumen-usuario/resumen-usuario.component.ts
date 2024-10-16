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
  public dias:string[]= [];
  private activatedRoute = inject(ActivatedRoute);

  constructor(public terminalService: TerminalService) {
    let ip = this.activatedRoute.snapshot.params['ip'];
    let puerto = this.activatedRoute.snapshot.params['puerto'];
    this.numDias = this.getNumDias(this.mesActual, this.gestion);
    for (var i = 1; i <= this.numDias; i++) {
      this.dias.push(this.getNombreDia(i).substring(0, 3) + " " + i);
    }
    
    terminalService.getMarcaciones(ip, puerto).subscribe(
      (data: any) => {
        console.log(data);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  getNumDias(mes: number, gestion: number) {
    return new Date(gestion, mes, 0).getDate();
  }

  getNombreDia(dia:number) {
    const birthday = new Date(this.gestion, this.mesActual, dia);
    const day1 = birthday.getDay();
    return env.dias[day1];
  }
}

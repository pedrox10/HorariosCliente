import {Component, OnInit} from '@angular/core';
import {HorarioService} from "../../../../servicios/horario.service";
import {Asueto} from "../../../../modelos/Asueto";
import {ExcepcionTickeo} from "../../../../modelos/ExcepcionTickeo";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-ver-excepciones',
  standalone: true,
  imports: [HttpClientModule],
  providers: [HorarioService],
  templateUrl: './ver-excepciones.component.html',
  styleUrl: './ver-excepciones.component.css'
})
export class VerExcepcionesComponent implements OnInit{

  excepciones: ExcepcionTickeo[] = [];
  constructor(public horarioService: HorarioService) {

  }

  ngOnInit() {
    this.horarioService.getExcepciones(80, 2025).subscribe(
      (data: any) => {
        this.excepciones = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }
}

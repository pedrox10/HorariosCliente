import {Component, Input} from '@angular/core';
import {EstadoJornada, Jornada} from "../../../modelos/Jornada";
import {RouterLink} from "@angular/router";
import {color} from "../../inicio/Global";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-jornada',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './jornada.component.html',
  styleUrl: './jornada.component.css'
})
export class JornadaComponent {
  @Input() jornada!:Jornada;

  constructor(private sanitizer: DomSanitizer) {

  }

  getNombre() {
    let res = ""
    let estado = this.jornada.estado
    if(estado === EstadoJornada.activa || estado === EstadoJornada.teletrabajo || estado === EstadoJornada.dia_libre) {
        res= this.jornada.horario.nombre
    } else {
      res = this.jornada.infoExtra.nombre
    }
    return res;
  }

  getTurno(turno: any) {
    let res = ""
    if(turno) {
      let horaEntrada = turno.horaEntrada.substring(0, 5)
      let horaSalida = turno.horaSalida.substring(0, 5)
      res = horaEntrada + " - " + horaSalida;
    }
    return res;
  }

  getDetalle() {
    let res = ""
    if(this.jornada.infoExtra.detalle.length > 48)
      res = this.jornada.infoExtra.detalle.substring(0, 44) + " ..."
    else
      res = this.jornada.infoExtra.detalle.substring(0, 48)
    return res;
  }

  agregarIconos() {
   let res = "<span class='badge is-bottom' style='margin-bottom: 8.5px; border: none;background-color: transparent; border-color: transparent; box-shadow: none;font-size:0.85em;'>" +
    "<div class='hitem''>";
   if(this.jornada.esInvierno)
     res = res + "<span title='Horario de Invierno'><i class='fas fa-mountain' style='color: #639ac5'></i></span>"
   if (this.jornada.esLactancia)
     res = res + "<span title='Horario de Lactancia'><i class='fas fa-baby' style='color: #e08686' ></i></span>"
   if(this.jornada.horario) {
     if (this.jornada.horario.jornadasDosDias)
       res = res + "<span title='Jornada de 2 dias'><i class='fas fa-moon' style='color: #878ae3' ></i></span>"
   }
    res = res + "</div></span>";
    return this.sanitizer.bypassSecurityTrustHtml(res);
  }

  getFondo() {
    let res = ""
    if(this.jornada.horario)
      res = color(this.jornada.horario.color)
    return res
  }

  getColorBorde() {
    let color = "";
    switch (this.jornada.estado) {
      case EstadoJornada.feriado:
        color = this.getColor("Purpura");
        break;
      case EstadoJornada.vacacion:
        color = this.getColor("Esmeralda");
        break;
      case EstadoJornada.baja_medica:
        color = this.getColor("Rojo");
        break;
      case EstadoJornada.permiso:
        color = this.getColor("Verde");
        break;
      default:
        color = "#DBDBDB"
    }
    return color;
  }

  getAnchoBorde() {
    let res="1px"
    let estado = this.jornada.estado
    if(estado === 1 || estado === 0 || estado === 8 || estado === 11) {
      res="1px"
    } else {
      res = "3px"
    }
    return res;
  }

  getColor(nombre: string) {
    return color(nombre)
  }
}



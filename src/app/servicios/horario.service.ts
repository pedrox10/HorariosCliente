import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {env} from "../../environments/environments";

@Injectable({
  providedIn: 'root'
})

export class HorarioService {

  private apiUrl = env.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getHorario(id: number) {
    return this.http.get(`${this.apiUrl}/horario/${id}`);
  }

  public getHorarios() {
    return this.http.get(`${this.apiUrl}/horarios`);
  }

  public asignarHorario(id: number, ids: string, ini: string, fin: any, jornadas: string, esInvierno: boolean, esLactancia: boolean) {
    return this.http.get(`${this.apiUrl}/asignar-horario/${id}/usuarios/${ids}/ini/${ini}/fin/${fin}/jornadas/${jornadas}`, {
      params: {
        invierno: esInvierno.toString(),
        lactancia: esLactancia.toString()
      }
    });
  }

  public crearHorario(horario: any, jornadas: any) {
    return this.http.get(`${this.apiUrl}/horario/crear/${horario}/${jornadas}`)
  }

  public editarHorario(id: number, body: any) {
    return this.http.put(`${this.apiUrl}/horario/editar/${id}`, body);
  }

  public eliminarHorario(id: number) {
    return this.http.get(`${this.apiUrl}/horario/${id}/eliminar`)
  }

  public getAsuetos() {
    return this.http.get(`${this.apiUrl}/asuetos`);
  }

  public editarFechaAsueto(id:number, fecha: string) {
    return this.http.get(`${this.apiUrl}/asueto/${id}/editarFecha/${fecha}`);
  }

  public getLicencias() {
    return this.http.get(`${this.apiUrl}/licencias`);
  }

  public  getJornadas(id: number, gestion: number, mes: number) {
    return this.http.get(`${this.apiUrl}/usuario/${id}/gestion/${gestion}/mes/${mes}`)
  }

  public  getJornadasPorMes(id: number, ini: string, fin: string) {
    return this.http.get(`${this.apiUrl}/usuario/${id}/jornadas/ini/${ini}/fin/${fin}`)
  }

  public  getExcepciones(id: number, gestion: number) {
    return this.http.get(`${this.apiUrl}/excepciones/${id}/gestion/${gestion}`)
  }

  public  getNumJornadas(id: number) {
    return this.http.get(`${this.apiUrl}/horario/${id}/jornadas`)
  }

  public  asignarDiaLibre(ids: string) {
    return this.http.get(`${this.apiUrl}/jornadas/${ids}/asignar-dia-libre`)
  }
}

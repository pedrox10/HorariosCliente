import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  private apiUrl = 'http://localhost:4000';
  constructor(private http: HttpClient) { }

  public getTerminales() {
    return this.http.get(`${this.apiUrl}/terminales`);
  }

  public getUsuarios(ip:string, puerto:number) {
    return this.http.get(`${this.apiUrl}/usuarios/` + ip + "/" + puerto);
  }

  public getRegistrosTiempo(gestion:number, mes:number) {
    return this.http.get(`${this.apiUrl}/registros/` + gestion + "/" + mes);
  }

}

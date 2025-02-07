import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {ResumenMarcacion} from "../modelos/ResumenMarcacion";
@Injectable()
export class DataService {

  private paramSource = new BehaviorSubject<ResumenMarcacion[]>([]);
  datoCompartido = this.paramSource.asObservable();

  constructor() { }

  cambiarDato(param: ResumenMarcacion[]) {
    this.paramSource.next(param)
  }

}

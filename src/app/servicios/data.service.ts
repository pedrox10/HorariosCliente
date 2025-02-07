import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {ResumenMarcacion} from "../modelos/ResumenMarcacion";
@Injectable({providedIn:"root"})
export class DataService {

   paramSource = new BehaviorSubject<ResumenMarcacion[]>([]);
  datoCompartido = this.paramSource.asObservable();

  constructor() { }

  cambiarDato(param: ResumenMarcacion[]) {
    this.paramSource.next(param)

  }

}



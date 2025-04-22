import { Component } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-interrupciones',
  standalone: true,
  imports: [],
  templateUrl: './interrupciones.component.html',
  styleUrl: './interrupciones.component.css'
})
export class InterrupcionesComponent {

  constructor(private location: Location) {

  }

  irAtras() {
    this.location.back();
  }
}

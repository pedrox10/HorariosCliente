import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { env } from '../../../environments/environments';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent {
  constructor() {
    console.log("Inicio Component");
    console.log(env.dias.toString());
    
  }
}

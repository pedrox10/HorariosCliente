import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, RouterModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = '';
  clave = '';
  recordar = false;
  mostrarClave = false;

  constructor(private router: Router) {

  }

  login() {
    console.log("voy ini")
    this.router.navigate(['/']);
  }
}

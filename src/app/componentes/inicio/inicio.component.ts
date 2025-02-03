import {Component, OnInit} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {color, mensaje, notificacion} from "./Global";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent implements OnInit{
  items: Array<HTMLLIElement> = [];
  action: any;

  constructor() {
    this.items = [];
  }

  ngOnInit() {
    mensaje("echo", "is-success")
    notificacion("<div class=''><p>Usuarios Agregados: 0</p><p>Nuevas Marcaciones: 0</p><p>Usuarios Agregados: 0</p><p>Nuevas Marcaciones: 0</p> </div>")
    this.items = Array.from(document.querySelectorAll('.item'));
    this.action  = document.getElementById('action') as HTMLDivElement
    let items = this.items;
    let action = this.action;
    this.items.forEach(item => {
      item.addEventListener('click', function(e){
        let li = e.target as HTMLLIElement;
        if( li.classList.contains('active') || li.classList.contains('fa-chevron-down')){
          return;
        }
        items.forEach(remove_active => {
          remove_active.classList.remove('active');
        });
        li.classList.add('active');
        document.documentElement.style.setProperty('--height-begin', action?.offsetHeight + 'px');
        document.documentElement.style.setProperty('--top-begin', action?.offsetTop + 'px');
        document.documentElement.style.setProperty('--height-end', li.offsetHeight + 'px');
        document.documentElement.style.setProperty('--top-end', li.offsetTop + 'px');
        action?.classList.remove('runanimation');
        void action?.offsetWidth;
        action?.classList.add('runanimation');
      },false)
    })

    let primer = document.getElementById("primer_item") as HTMLLIElement;
    //primer.click()
  }
}

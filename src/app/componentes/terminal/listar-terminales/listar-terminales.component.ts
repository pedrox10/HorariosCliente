import {Component, OnInit} from '@angular/core';
import { TerminalComponent } from '../terminal.component';
import { TerminalService } from '../../../servicios/terminal.service';
import { HttpClientModule } from '@angular/common/http';
import {Location} from '@angular/common';
import {Terminal} from "../../../modelos/terminal.model";

@Component({
  selector: 'app-listar-terminales',
  standalone: true,
  imports: [TerminalComponent, HttpClientModule],
  providers: [TerminalService],
  templateUrl: './listar-terminales.component.html',
  styleUrl: './listar-terminales.component.css'
})

export class ListarTerminalesComponent implements OnInit{
  public terminales: Terminal[] = [];
  public element = document.getElementById("terminales");
  public constructor(public terminalService: TerminalService, public location: Location) {

  }

  ngOnInit(): void {
    this.getTerminales()
  }

  getTerminales() {
    this.terminalService.getTerminales().subscribe(
      (data: any) => {
        this.terminales = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

}

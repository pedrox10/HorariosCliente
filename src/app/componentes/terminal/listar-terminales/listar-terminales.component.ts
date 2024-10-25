import { Component } from '@angular/core';
import { TerminalComponent } from '../terminal.component';
import { TerminalService } from '../../../servicios/terminal.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listar-terminales',
  standalone: true,
  imports: [TerminalComponent, HttpClientModule],
  providers: [TerminalService],
  templateUrl: './listar-terminales.component.html',
  styleUrl: './listar-terminales.component.css'
})

export class ListarTerminalesComponent {
  public terminales: any;
  public element = document.getElementById("terminales");
  public constructor(public terminalService: TerminalService) {

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

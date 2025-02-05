import {Component, OnInit} from '@angular/core';
import * as XLSX from "xlsx-js-style";
import {ModalService} from "ngx-modal-ease";
import {TerminalService} from "../../../servicios/terminal.service";
import {Usuario} from "../../../modelos/Usuario";
import {HttpClientModule} from "@angular/common/http";
import {concatMap, from, toArray} from "rxjs";
import {ResumenMarcacion} from "../../../modelos/ResumenMarcacion";
import {format} from "../../inicio/Global";
import {InfoMarcacion} from "../../../modelos/InfoMarcacion";
import {IFecha} from "../../../modelos/Fecha";
import moment from "moment";

@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [HttpClientModule],
  providers: [TerminalService],
  templateUrl: './ver-reporte.component.html',
  styleUrl: './ver-reporte.component.css'
})
export class VerReporteComponent implements OnInit{

  usuarios: Usuario[] = [];
  fileName= 'ExcelSheet.xlsx';
  fechaIni: string|any = undefined;
  fechaFin: string|any = undefined;
  reportes: ResumenMarcacion[] = [];

  constructor(private modalService: ModalService, public terminalService: TerminalService) {

  }

  ngOnInit() {
    let data: any = this.modalService.options?.data
    if(data){
      this.usuarios = data.usuarios;
      this.fechaIni = data.fechaIni;
      this.fechaFin = data.fechaFin;
      const result$ =
        from(this.usuarios)
          .pipe(
            concatMap(usuario => {
              return this.terminalService.getInfoMarcaciones(usuario.id!, this.fechaIni, this.fechaFin)
            }),
            toArray()
          );
        result$.subscribe((data: any) => {
          this.reportes = data
          console.log(data)
        },
        (error: any) => {
          console.error('An error occurred:', error);
        })
    } else {
      let ids_usuarios: number[] = []
      ids_usuarios.push(2,3,4,5,80,81)
      const result$ =
        from(ids_usuarios)
          .pipe(
            concatMap(id_usuario => {
              return this.terminalService.getInfoMarcaciones(id_usuario, "20250101", "20250131")
            }),
            toArray()
          );
      result$.subscribe((data: any) => {
          this.reportes = data
          console.log(data)
        },
        (error: any) => {
          console.error('An error occurred:', error);
        })
    }
  }

  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('tabla_reporte');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    for (var i in ws) {
      console.log(ws[i]);
      if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);
      ws[i].s = {
        // styling for all cells
        font: {
          name: 'arial',
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
          wrapText: '1', // any truthy value here
        },
        border: {
          top: {
            style: 'thin',
            color: '000000',
          },
          bottom: {
            style: 'thin',
            color: '000000',
          },
        },
      };

      if (cell.r == 0) {
        // first row
        ws[i].s.border.bottom = {
          // bottom border
          style: 'thin',
          color: 'FF0000',
        };
      }
    }
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  formatear(fecha: Date) {
    return format(fecha)
  }

  getRetrasos(infoMarcaciones: InfoMarcacion[]) {
    let retrasos = "";
    for (let info of infoMarcaciones) {
      if(info.cantRetrasos > 0) {
        retrasos = retrasos + "<span class=''> "+ moment(info.fecha).format("DD/MM/YYYY") + " " + info.minRetrasos+ "</span>"
      }
    }
    return retrasos
  }
}

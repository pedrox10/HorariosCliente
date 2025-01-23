import { Component } from '@angular/core';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [],
  templateUrl: './ver-reporte.component.html',
  styleUrl: './ver-reporte.component.css'
})
export class VerReporteComponent {


  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('tabla_marcaciones');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

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
}

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatriculaData } from 'src/app/models/matricula';
import * as _ from "lodash";

@Component({
  selector: 'app-ficha-escolar',
  templateUrl: './ficha-escolar.component.html',
  styleUrls: ['./ficha-escolar.component.css']
})
export class FichaEscolarComponent implements OnInit {
  data: MatriculaData;
  agnos: any;
  selectedYear: any;
  columnRange: number[];
  dataByYear: { year: string; items: any; }[];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {

    this.dataService.getDataFlujoEscolar()
    .then((data:MatriculaData) => {
      this.data = data;
      this.processData(data)
      //this.agnos = this.data.map(d => d.agno)
      //this.selectedYear = this.agnos[this.agnos.length-1]

    })

  }

  cellLabel(d) {
    if (d && d.nivel == "EM") {
      return ({"1": "I", "2":"II", "3":"III", "4":"IV"})[d.grado]
    } else if  (d && d.nivel == "ES") {
      return ({"Universidades": "U", "Centros de Formación Técnica":"CFT", "Institutos Profesionales":"IP"})[d.tipo_inst]
    } else {
      return d.tipo_inst
    }
  }

  cellTitle(d) {
    if (d && d.nivel == "EM") {
      return `${d.record.nom_rbd} (${d.record.nom_com_rbd})`
    } else if  (d && d.nivel == "ES") {
      return `${d.record.nomb_carrera} (${d.record.nomb_inst})`
    } else {
      return d.tipo_inst
    }
  }

  studentInfo(d) {
    if (d && d.record8vo) {
      return `${d.record8vo.gen_alu == "1" ? "H" : "M"} (${d.record8vo.edad_alu})`
    }
  }

  processData(data) {
    const maxColumns = <number> _.chain(data).map((items,key) =>  _.max(items.map(d => d.postBasica.length))).max().value();
    this.columnRange = _.range(0,maxColumns);

    this.dataByYear = _.chain(data).map((items,key) => ({year: key, items:items})).value();

    /*
    display = {
      const maxColumns =  _.chain(egresadosXagno).map((items,key) =>  _.max(items.map(d => d.postBasica.length))).max(d => d).value();
      
      const range = _.range(0,maxColumns)
      
      function table(data, agno)  {
        return `
        <table class="table">
        <tr>
        ${range.map(e => `
          <th>${+e + +agno + 1}</th>
        `).join("")}
    
        </tr>
        ${data.map(d => `
        <tr>
        ${range.map(e => `
          <td class="${cellClass(d.postBasica[e])}">${(d.postBasica[e] && cellLabel(d.postBasica[e])) || ""}</td>
        `).join("")}
    
        </tr>
        `).join("")}
        </table>
        `
      }
      
      return html`${
      _.map(egresadosXagno, (items, agno) => `
      <h3>${agno} en 8º Básico</h3>
      ${table(items, agno)}
      `).join("")
      }`
      
      return table(egresadosXagno["2006"])
      
    
    }
    */
  }

  changeYear(year) {
    this.selectedYear = year;
  }


}

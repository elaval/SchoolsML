import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatriculaData } from 'src/app/models/matricula';
import * as _ from "lodash";
import * as moment from "moment";

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
  params: any;
  dataByYearDict: { year: string; items: any; }[];
  selectedData: any;
  selectedYearStatistics: any;
  sortedHighSchools: any[];
  sortedProgramasEdSup: any[];
  validUser: boolean;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {

    this.dataService.data.subscribe((data:MatriculaData) => {
      if (data) {
        this.data = data;
        this.processData(data)
  
        this.dataService.params.subscribe(params => {
          if (params) {
            this.params = params;
            this.selectedYear = params.years && params.years[0];
    
            this.selectedData = this.dataByYearDict[this.selectedYear];
            this.selectedData = _.sortBy(this.selectedData, d => this.getNotaNem(d))

          }
        })
      } else {
        this.data = null;
        this.dataByYear = null;
        this.dataByYearDict = null;
        this.selectedData = null;    
      }

      this.dataService.validUser.subscribe(d => {
        this.validUser = d;
      })
      
    })

    this.dataService.selectedYear.subscribe(year => {
      if (year) {
        this.selectedYear = year;

        this.selectedData = this.dataByYearDict && this.dataByYearDict[this.selectedYear]
        this.selectedData = _.sortBy(this.selectedData, d => this.getNotaNem(d))

      }
    })

    this.dataService.paramsSelectedYear.subscribe(statistics => {
      if (statistics) {
        this.selectedYearStatistics = statistics;
        this.setSortedHighSchools(statistics.highSchools);
        this.setSortedProgramasEdSup(statistics.edSupPrograms)
      } 
    })
  }

  setSortedHighSchools(highSchools) {
    this.sortedHighSchools = []
    if (highSchools) {
      this.sortedHighSchools = _.chain(highSchools)
      .map(d => d).sortBy(d => -d.numStudents).value();
    }
  }

  setSortedProgramasEdSup(programas) {
    this.sortedProgramasEdSup = []
    if (programas) {
      this.sortedProgramasEdSup = _.chain(programas)
      .map(d => d)
      .sortBy(d => -d.numStudents)
      .sortBy(d => `${d.tipoInstitucion}`)
      .value();
    }
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

  yearTooltip(d,i) {
    let msg = "";
    if (d.postBasica[i] && this.cellTitle(d.postBasica[i])) {
      msg = this.cellTitle(d.postBasica[i]);
    }

    const recordTitulo = this.cellInfoTitulo(d,i);
    if (recordTitulo) {
      msg += msg ? `, Título: ${recordTitulo}` : `Título: ${recordTitulo}`; 
    }

    return msg;
  }

  cellInfoTitulo(d,i) {
    const recordTitulo = this.hasTitulo(d, i);
    return recordTitulo ? recordTitulo.nomb_titulo_obtenido : "";
  }

  isNem(d,i) {
    if (d && d.fullRecord) {
      const year = +this.selectedYear + i +1;
      const yearEgreso = (d.fullRecord.nem && +d.fullRecord.nem.AGNO_EGRESO) 
        || (d.fullRecord.nemAdulto && +d.fullRecord.nemAdulto.agno_egreso);
      if (year == yearEgreso) {
        return true
      } else {
        return false
      }
    } 
 
  }

  infoNEM(d) {
    if (d && d.fullRecord && d.fullRecord.nem && d.fullRecord.nem.NEM ) {
      //return `promedio NEM: ${d.fullRecord.nem.NEM}, percentil: ${d.fullRecord.nem.PERCENTIL}`
      return `${d.fullRecord.nem.NEM}, p.${d.fullRecord.nem.PERCENTIL}`
    } else if (d && d.fullRecord && d.fullRecord.nemAdulto && d.fullRecord.nemAdulto.nem ){
      return `${d.fullRecord.nemAdulto.nem}, p.${d.fullRecord.nemAdulto.percentil} A`
    } else {
      return null
    }
 
  }

  nemAdulto(d) {
    if (d && d.fullRecord && d.fullRecord.nemAdulto && d.fullRecord.nemAdulto.nem ){
      return true
    } else {
      return false
    }
  }

  hasTitulo(d, i) {
    if (d && d.fullRecord && d.fullRecord.titulosEdSuperior) {
      const year = +this.selectedYear + i +1;

      const recordTitulo = _.find(d.fullRecord.titulosEdSuperior, e => {
        return e.cat_periodo == "TIT_" + year;
      })
      if (recordTitulo) {
        return recordTitulo
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  
  studentDetailedInfo(d) {
    if (d && d.record8vo) {
      return `${d.record8vo.gen_alu == "1" ? "Hombre" : "Mujer"}, ${d.record8vo.edad_alu} años (${d.record8vo.gen_alu == "1" ? "Nacido" : "Nacida"}: ${moment(d.record8vo.fec_nac_alu,"YYYYMMDD").format("MMM YYYY")})`
    }
  }

  studentBasicInfo(d) {
    if (d && d.record8vo) {
      return `${d.record8vo.gen_alu == "1" ? "H" : "M"}`
    }
  }

  processData(data) {
    const maxColumns = <number> _.chain(data).map((items,key) =>  _.max(items.map(d => d.postBasica.length))).max().value();
    this.columnRange = _.range(0,maxColumns);

    this.dataByYear = _.chain(data).map((items,key) => ({year: key, items:items})).value();
    this.dataByYearDict = data;
    this.selectedData = this.dataByYearDict[this.selectedYear]
    this.selectedData = _.sortBy(this.selectedData, d => this.getNotaNem(d))
  }

  /**
   * Obtiene la nota de EM, ya sea del registro de jóvenes o de adulto
   * @param d 
   */
  getNotaNem(d) {
    return (d && d.fullRecord && d.fullRecord.nem && -d.fullRecord.nem.NEM) ||
          (d && d.fullRecord && d.fullRecord.nemAdulto && -d.fullRecord.nemAdulto.nem)
  }

  changeYear() {
    this.selectedData = this.dataByYearDict[this.selectedYear]
    this.selectedData = _.sortBy(this.selectedData, d => this.getNotaNem(d))

  }


}

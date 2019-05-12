import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatriculaData } from 'src/app/models/matricula';

@Component({
  selector: 'app-evolucion-matricula',
  templateUrl: './evolucion-matricula.component.html',
  styleUrls: ['./evolucion-matricula.component.css']
})
export class EvolucionMatriculaComponent implements OnInit {
    data: MatriculaData;
    agnos: any;
    selectedYear: any;
  
    constructor(
      private dataService: DataService
    ) { }
  
    ngOnInit() {

  
    }
  
    changeYear(year) {
      this.selectedYear = year;
    }
  
  
  }
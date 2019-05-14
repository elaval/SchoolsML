import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { BehaviorSubject } from 'rxjs';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FILE_DIRECTORIO_PATH } from '../config';
import { getHeapStatistics } from 'v8';
import { Student } from '../models/student';
import { StudentCollection } from '../models/studentCollection';
import { isNull } from '@angular/compiler/src/output/output_ast';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  user: any;
  directorio={};
  selectedSede: { sede: string; carreras: (Function | (() => string) | (() => string) | (() => Object) | ((v: string | number | symbol) => boolean) | ((v: Object) => boolean) | ((v: string | number | symbol) => boolean))[]; };
  selectedCarrera: Function | (() => string) | (() => string) | (() => Object) | ((v: string | number | symbol) => boolean) | ((v: Object) => boolean) | ((v: string | number | symbol) => boolean);
  dataCarrera: Object;
  data_matricula: any;

  validUserSubjet = new BehaviorSubject(false);
  validUser = this.validUserSubjet.asObservable();

  dataSubjet = new BehaviorSubject(null);
  data = this.dataSubjet.asObservable();

  paramsSubjet = new BehaviorSubject(null);
  params = this.paramsSubjet.asObservable();

  paramsSelectedYearSubjet = new BehaviorSubject(null);
  paramsSelectedYear = this.paramsSelectedYearSubjet.asObservable();

  private selectedYearSubjet = new BehaviorSubject(null);
  selectedYear = this.selectedYearSubjet.asObservable();
  
  data_flujo: any;
  mySchools: any = [];
  selectedSchool: any;
  allStudents: StudentCollection;
  allYears: string[];
  allStudentsStatistics: {};
  _selectedYear: string;
  studentsPerYear: {};
  userData = null;

  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage,
    private http: HttpClient,
    private fireStore: AngularFirestore

  ) { 
    this.authService.user.subscribe(user => {
      this.user = user;

      this.getValidUserData()
      .then(()=> {
        const ref = this.storage.ref(FILE_DIRECTORIO_PATH);

        return ref.getDownloadURL().toPromise();
      })
      .then(url => {
        return d3.tsv(url);
      })
      .then(data => {
        // Download school directory ans create a map for each school id
        data.forEach(d => {
          this.directorio[d.rbd] = d;
        })
        return this.getMySchools();
      })
      .then((data:[]) => {
        if (data) {
          this.mySchools = data.map(d => this.directorio[d]);
          this.selectedSchool = this.mySchools && this.mySchools[0];
          this.getDataFlujoEscolar2(this.selectedSchool)
        }

      })
      .catch((err) => {
        this.mySchools = [];
        this.selectedSchool = null;
        this.allYears = null;
        this.selectedYear = null;
        this.dataSubjet.next(null);
        console.error(err);
      })

    })
  }

  
  getDataFlujoEscolar2(school) {
    this.getValidUserData()
    .then(() => {
      this.data_flujo = null;
      this.dataSubjet.next(this.data_flujo);

      const ref = this.storage.ref(`establecimientos/${school.rbd}/flujo8vo.json`);
      ref.getDownloadURL().subscribe(url => {
        this.http.get(url).toPromise()
        .then(data => {
          this.data_flujo = data;
          this.getDataParameters(data);
          this.dataSubjet.next(data);
        })
        .catch(err => {
          this.dataSubjet.error(err)
        });
      })
    })
  }

  /*
  getDataFlujoEscolar() {
    return new Promise((resolve, reject) => {
      if (this.data_flujo) {
        resolve(this.data_flujo)
      } else {
        const ref = this.storage.ref(`establecimientos/${school}/flujo8vo.json`);
        ref.getDownloadURL().subscribe(url => {
          this.http.get(url).toPromise()
          .then(data => {
            this.data_flujo = data;
            this.getDataParameters(data);
            resolve(data)
          })
          .catch(err => {
            reject(err);
          });
        },
        err => reject(err));
      }
    })
  }
  */

  getDataParameters(data) {
    this.allStudents = new StudentCollection();
    this.studentsPerYear = {};

    this.allYears = _.map(data, (items, year) => year);
    this._selectedYear = this.allYears && this.allYears[0];

    // Create student collections for every year
    _.each(data, (items,year) => {
      this.studentsPerYear[year] = this.studentsPerYear[year] || new StudentCollection();


      items.forEach(d => {
        const newStudent = new Student(d);
        this.allStudents.addStudent(newStudent);
        this.studentsPerYear[year].addStudent(newStudent);
      });
    })

    this.allStudentsStatistics = this.allStudents.getStatistics();

    this.paramsSubjet.next({
      years: this.allYears,
      yearsRange : d3.extent(this.allYears),
      statistics : this.allStudentsStatistics     
    })

    this.changeYear();
  }

  getMySchools() {
    return new Promise((resolve, reject) => {
      this.authService.user.subscribe(user => {
        this.user = user;
  
        if (user && user.email) {  
          this.fireStore.collection("users").doc(user.email).get().subscribe((d) => {
            const userData = d.data();
            this.mySchools = userData && userData.schools || [];
            resolve(userData && userData.schools)
          },
          err => {
            reject(err)
          })
        }
      },
      err => {
        reject(err);
      })
       
    })
  }

  getValidUserData() {
    return new Promise((resolve, reject) => {
      if (this.user && this.user.email) {  
        this.fireStore.collection("users").doc(this.user.email).get().subscribe((d) => {
          const userData = d.data();
          this.userData = userData;

          if (userData && userData["schools"] && userData["schools"].length) {
            this.validUserSubjet.next(true);
            resolve(userData)
          } else {
            this.validUserSubjet.next(false);
            reject("No schools")
          }

        },
        err => {
          reject(err)
        })
      }
    })
  }

  getAllSchools() {
    return new Promise((resolve, reject) => {
      this.authService.user.subscribe(user => {
        this.user = user;
  
        if (user && user.uid) {  
          this.fireStore.collection("schools").get().subscribe(querySnapshot => {
            const output = {};
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              output[doc.id] = doc.data();
            });
            resolve(output)
          },
          err => {
            reject(err)
          })
        }
      },
      err => {
        reject(err);
      })
       
    })
  }

  /**
   * Called when a new year is selected from the top nav bar
   */
  changeYear() {
    this.selectedYearSubjet.next(this._selectedYear);

    const yearStatistics = this.studentsPerYear[this._selectedYear].getStatistics();
    const yearHighSchools = this.studentsPerYear[this._selectedYear].getHighSchools();
    const yearEdSupPrograms = this.studentsPerYear[this._selectedYear].getEdSup();
    yearStatistics["highSchools"] = yearHighSchools;
    yearStatistics["edSupPrograms"] = yearEdSupPrograms;

    this.paramsSelectedYearSubjet.next(yearStatistics)
  }

  changeSchool() {
    this.getDataFlujoEscolar2(this.selectedSchool)
  }
 
}

import * as _ from 'lodash';
import { StudentRecord, Student } from './student';



export class StudentCollection {
  students: Student[] = [];

  constructor(students: Student[] = []) {
    this.students = students
  }

  addStudent(student) {
    this.students.push(student);
  }

  getStatistics() {

    const statistics = {};

    statistics["count"] = this.students.length;
    statistics["nem"] = _.reduce(this.students, (memo, d) => {
      return memo + (d.terminoSecundaria() ? 1 : 0);
    }, 0);
    statistics["edsup"] = _.reduce(this.students, (memo, d:Student) => {
      return memo + (d.ingresoEdSuperior() ? 1 : 0);
    }, 0);

    return statistics

  }

  getHighSchools() {
    const highSchools =  {};
    this.students.forEach((d:Student) => {
      const studentHighSchools = d.getHighSchools();
      _.each(studentHighSchools, (d, key) => {
        highSchools[key] = highSchools[key] || {
          name: null,
          comuna: null,
          numStudents: 0
        }

        highSchools[key].name = d.name;
        highSchools[key].comuna = d.comuna;
        highSchools[key].numStudents += 1;
      })

      
    })

    return highSchools;
  }


  getEdSup() {
    const edSupPrograms =  {};
    this.students.forEach((d:Student) => {
    const studentEdSupPrograms = d.getEdSup();
      _.each(studentEdSupPrograms, (d, key) => {
        edSupPrograms[key] = edSupPrograms[key] || {
          carrera: null,
          institucion: null,
          tipoInstitucion: null,
          numStudents: 0
        }

        edSupPrograms[key].carrera = d.carrera;
        edSupPrograms[key].institucion = d.institucion;
        edSupPrograms[key].tipoInstitucion = d.tipoInstitucion;
        edSupPrograms[key].numStudents += 1;
      })
    })
    return edSupPrograms;
  }

    

}


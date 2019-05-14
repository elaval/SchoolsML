import * as _ from 'lodash';
import { Compiler_compileModuleAndAllComponentsAsync__POST_R3__ } from '@angular/core/src/linker/compiler';

export interface StudentYearRecord {
  id : any,
  mrun: string,
  count_matricula_ed_superior: number,
  matricula_ed_superior: any[],
  matricula_escolar: any[],
  nem : {}
}

export interface StudentRecord {
  fullRecord : StudentYearRecord,
  postBasica: {
    nivel:string,
    grado: string,
    record: MatriculaEscolarRecord | MatriculaEdSuperiorRecord
  }[]
  record8vo : MatriculaEscolarRecord
}

export interface MatriculaEscolarRecord {
  agno: string,
  cod_com_alu: string,
  cod_com_rbd: string,
  cod_depe: string,
  cod_depe2: string,
  cod_ense: string,
  cod_ense2: string,
  cod_ense3: string,
  cod_espe: string,
  cod_grado: string,
  cod_grado2: string,
  cod_jor: string,
  cod_rama: string,
  cod_reg_alu: string,
  cod_reg_rbd: string,
  cod_sec: string,
  cod_tip_cur: string,
  dgv_rbd: string,
  edad_alu: string,
  ens: string,
  fec_nac_alu: string,
  gd_alu: string,
  gen_alu: string,
  let_cur: string,
  let_rbd: string,
  mrun: string,
  nom_com_alu: string,
  nom_com_rbd: string,
  nom_rbd: string,
  num_rbd: string,
  rbd: string,
  repite_alu: string,
  rural_rbd: string,
}

export interface MatriculaEdSuperiorRecord {
  acre_carr_agencia: string,
  acre_carr_fecha_inicio: string,
  acre_carr_numero_anio: string, 
  acre_inst_anio: string,
  acre_inst_desde_hasta: string, 
  acreditada_carr: string, 
  acreditada_inst: string, 
  anio_ing_carrera: string,
  anio_mat_pri_anio: string, 
  area_carrera_generica: string, 
  area_conocimiento: string, 
  cat_periodo: string, 
  ciudad_sede: string, 
  cod_inst: string,
  cod_sede: string, 
  codigo_demre: string, 
  codigo_unico: string, 
  comuna_sede: string,
  costo_obtencion_titulo_diploma: string,
  costo_proceso_titulacion: string, 
  costo_tit_explicacion_observacio: string,
  dur_estudio_carr: string,
  dur_proceso_tit: string, 
  dur_total_carr: string,
  edad_alu: string,
  fec_nac_alu: string, 
  gen_alu: string, 
  jornada: string, 
  modalidad: string, 
  mrun: string, 
  nivel_carrera_1: string,
  nivel_carrera_2: string,
  nivel_global: string,
  nomb_carrera: string,
  nomb_inst: string, 
  nomb_sede: string, 
  oecd_area: string, 
  oecd_subarea: string,
  otro_estudiante_proceso_terminal: string,
  pais_estudios_previos: string,
  rango_edad: string, 
  region_sede: string,
  sem_ing_carrera: string, 
  sem_mat_pri_anio: string,
  tipo_inst_1: string,
  tipo_inst_2: string,
  tipo_inst_3: string,
  tipo_plan_carr: string,
  valor_arancel: string, 
  valor_matricula: string, 
  version: string,
}

export interface HighSchoolMap { [s: string]: {
  name: string,
  comuna: string,
  count: number
}; }


export interface EdSupProgramsMap { [s: string]: {
  carrera: string,
  institucion: string,
  tipoInstitucion:string,
  count: number
}; }




export class Student {
  record: StudentRecord;
  constructor(record: StudentRecord) {
    this.record = record
  }

  terminoSecundaria() {
    return !!(this.record.fullRecord.nem && this.record.fullRecord.nem["AGNO_EGRESO"]) || false;
  }

  ingresoEdSuperior() {
    return !!(this.record.fullRecord.count_matricula_ed_superior || (this.record.fullRecord.matricula_ed_superior && this.record.fullRecord.matricula_ed_superior.length))
  }

  /**
   * Gets a dict with all the highschools this student has been enrolled
   */
  getHighSchools() {
    const highSchools:HighSchoolMap = {}
    this.record.postBasica.filter(d => d && d.nivel == "EM").forEach((d) => {
      const record = <MatriculaEscolarRecord>d.record;
      highSchools[record.rbd] = highSchools[record.rbd] || { 
        name: null,
        comuna: null,
        count : 0
      };
      highSchools[record.rbd]["name"] = record.nom_rbd;
      highSchools[record.rbd]["comuna"] = record.nom_com_rbd;
      highSchools[record.rbd]["count"] += 1;
    })

    return highSchools
  }

    /**
   * Gets a dict with all the higher ed institutions this student has been enrolled
   */
  getEdSup() {
    const edSupPrograms:EdSupProgramsMap = {}
    this.record.postBasica.filter(d => d && d.nivel == "ES").forEach((d) => {
      const record = <MatriculaEdSuperiorRecord>d.record;
      edSupPrograms[record.codigo_unico] = edSupPrograms[record.codigo_unico] || {
        carrera: null,
        institucion: null,
        tipoInstitucion: null,
        count: 0
      }

      edSupPrograms[record.codigo_unico]["carrera"] = record.nomb_carrera;
      edSupPrograms[record.codigo_unico]["institucion"] = record.nomb_inst;
      edSupPrograms[record.codigo_unico]["tipoInstitucion"] = record.tipo_inst_1;
      edSupPrograms[record.codigo_unico]["count"] += 1;
    })

    return edSupPrograms
  }
}


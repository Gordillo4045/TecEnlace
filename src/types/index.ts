export interface Student {
    id_alumno: number;
    no_control: string;
    nombre_completo: string;
    nombre_carrera: string;
    estatus: string;
    calificacion_tutorias: number;
    nivel_tutoria: string;
    semestre_actual: number;
    tutor_asignado: string;
    status_asignacion: string;
    motivo: string | null;
    paquete_inscrito?: string;
    id_carrera?: number;
}

export interface Tutor {
    id_tutor: number;
    nombre_completo: string;
    estatus: string;
    num_estudiantes: number;
}

export interface Statistics {
    nombre_carrera: string;
    total_alumnos: number;
    promedio_calificacion_tutorias: number;
    total_tutores: number;
}

export interface PeriodStatistics {
    total_alumnos: number;
    total_tutores: number;
    total_entrevistas: number;
    total_canalizaciones: number;
    promedio_calificaciones: number;
    alumnos_con_tutor: number;
    alumnos_sin_tutor: number;
    canalizaciones_pendientes: number;
}

export interface Period {
    id_periodo: number;
    nombre_periodo: string;
}

export interface Career {
    id_carrera: number;
    nombre_carrera: string;
}
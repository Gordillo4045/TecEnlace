import { Student, Tutor, Statistics, PeriodStatistics, Career } from '@/types';

// Datos iniciales de ejemplo
const initialStudents: Student[] = [
    {
        id_alumno: 1,
        no_control: "19211234",
        nombre_completo: "Juan Pérez García",
        nombre_carrera: "Ingeniería en Sistemas Computacionales",
        estatus: "Activo",
        calificacion_tutorias: 85,
        nivel_tutoria: "Básico",
        semestre_actual: 3,
        tutor_asignado: "Sin asignar",
        status_asignacion: "Sin asignar",
        motivo: null,
        id_carrera: 1
    },
    {
        id_alumno: 2,
        no_control: "19211235",
        nombre_completo: "María Rodríguez López",
        nombre_carrera: "Ingeniería en Sistemas Computacionales",
        estatus: "Activo",
        calificacion_tutorias: 90,
        nivel_tutoria: "Intermedio",
        semestre_actual: 5,
        tutor_asignado: "Sin asignar",
        status_asignacion: "Sin asignar",
        motivo: null,
        id_carrera: 1
    },
    {
        id_alumno: 3,
        no_control: "19211236",
        nombre_completo: "Carlos González Torres",
        nombre_carrera: "Ingeniería en Sistemas Computacionales",
        estatus: "Activo",
        calificacion_tutorias: 78,
        nivel_tutoria: "Básico",
        semestre_actual: 2,
        tutor_asignado: "Sin asignar",
        status_asignacion: "Sin asignar",
        motivo: null,
        id_carrera: 1
    },
    {
        id_alumno: 4,
        no_control: "19211237",
        nombre_completo: "Daniel Gonzalez",
        nombre_carrera: "Ingeniería en Sistemas Computacionales",
        estatus: "Activo",
        calificacion_tutorias: 100,
        nivel_tutoria: "Básico",
        semestre_actual: 2,
        tutor_asignado: "Sin asignar",
        status_asignacion: "Sin asignar",
        motivo: null,
        id_carrera: 1
    },
    {
        id_alumno: 5,
        no_control: "19211238",
        nombre_completo: "Andre Vizuet Acosta",
        nombre_carrera: "Ingeniería en Sistemas Computacionales",
        estatus: "Activo",
        calificacion_tutorias: 100,
        nivel_tutoria: "Básico",
        semestre_actual: 7,
        tutor_asignado: "Sin asignar",
        status_asignacion: "Sin asignar",
        motivo: null,
        id_carrera: 1
    },
    {
        id_alumno: 6,
        no_control: "19211239",
        nombre_completo: "Edgar Cabrera Soriano",
        nombre_carrera: "Ingeniería Industrial",
        estatus: "Activo",
        calificacion_tutorias: 70,
        nivel_tutoria: "Básico",
        semestre_actual: 2,
        tutor_asignado: "Sin asignar",
        status_asignacion: "Sin asignar",
        motivo: null,
        id_carrera: 2
    }
];

const initialTutors: Tutor[] = [
    {
        id_tutor: 1,
        nombre_completo: "Dr. Luis Martínez",
        estatus: "Activo",
        num_estudiantes: 0,
        motivo: "Asignación inicial"
    },
    {
        id_tutor: 2,
        nombre_completo: "Dra. Ana Sánchez",
        estatus: "Activo",
        num_estudiantes: 0,
        motivo: "Asignación inicial"
    },
    {
        id_tutor: 3,
        nombre_completo: "Dr. Roberto Hernández",
        estatus: "Activo",
        num_estudiantes: 0,
        motivo: "Asignación inicial"
    },
    {
        id_tutor: 4,
        nombre_completo: "Mtra. Carmen Jiménez",
        estatus: "Activo",
        num_estudiantes: 0,
        motivo: "Asignación inicial"
    },
    {
        id_tutor: 5,
        nombre_completo: "Dr. Miguel Ángel Ramírez",
        estatus: "Activo",
        num_estudiantes: 0,
        motivo: "Asignación inicial"
    },
];

const initialCareers: Career[] = [
    {
        id_carrera: 1,
        nombre_carrera: "Ingeniería en Sistemas Computacionales"
    },
    {
        id_carrera: 2,
        nombre_carrera: "Ingeniería Industrial"
    },
    {
        id_carrera: 3,
        nombre_carrera: "Ingeniería Mecatrónica"
    }
];

export const localStorageService = {
    // Inicializar datos
    initializeData: () => {
        // Forzar la actualización de los datos
        localStorage.setItem('tutors', JSON.stringify(initialTutors));
        localStorage.setItem('students', JSON.stringify(initialStudents));
        localStorage.setItem('careers', JSON.stringify(initialCareers));
    },

    // Estudiantes
    students: {
        getAll: (): Student[] => {
            return JSON.parse(localStorage.getItem('students') || '[]');
        },

        assign: (tutorId: number, studentIds: number[], motivo: string): void => {
            const students = JSON.parse(localStorage.getItem('students') || '[]');
            const tutors = JSON.parse(localStorage.getItem('tutors') || '[]');

            const tutor = tutors.find((t: Tutor) => t.id_tutor === tutorId);

            students.forEach((student: Student) => {
                if (studentIds.includes(student.id_alumno)) {
                    student.tutor_asignado = tutor?.nombre_completo || 'Sin asignar';
                    student.status_asignacion = 'Asignado';
                    student.motivo = motivo;
                }
            });

            localStorage.setItem('students', JSON.stringify(students));
        }
    },

    // Tutores
    tutors: {
        getAll: (): Tutor[] => {
            const tutors = localStorage.getItem('tutors');
            if (!tutors) {
                localStorage.setItem('tutors', JSON.stringify(initialTutors));
                return initialTutors;
            }
            return JSON.parse(tutors);
        }
    },

    // Carreras
    careers: {
        getAll: (): Career[] => {
            return JSON.parse(localStorage.getItem('careers') || '[]');
        }
    },

    // Estadísticas
    statistics: {
        getAll: (): Statistics[] => {
            const students = JSON.parse(localStorage.getItem('students') || '[]') as Student[];
            const careers = JSON.parse(localStorage.getItem('careers') || '[]') as Career[];

            return careers.map((career: Career) => ({
                nombre_carrera: career.nombre_carrera,
                total_alumnos: students.filter((s: Student) => s.id_carrera === career.id_carrera).length,
                promedio_calificacion_tutorias: students
                    .filter((s: Student) => s.id_carrera === career.id_carrera)
                    .reduce((acc: number, curr: Student) => acc + curr.calificacion_tutorias, 0) / students.length || 0,
                total_tutores: JSON.parse(localStorage.getItem('tutors') || '[]').length
            }));
        }
    },

    // Estadísticas del período
    periodsStatistics: {
        getAll: (): PeriodStatistics => {
            const students = JSON.parse(localStorage.getItem('students') || '[]') as Student[];
            const tutors = JSON.parse(localStorage.getItem('tutors') || '[]');

            return {
                total_alumnos: students.length,
                total_tutores: tutors.length,
                total_entrevistas: 0,
                total_canalizaciones: 0,
                promedio_calificaciones: students.reduce((acc: number, curr: Student) => acc + curr.calificacion_tutorias, 0) / students.length || 0,
                alumnos_con_tutor: students.filter((s: Student) => s.status_asignacion === 'Asignado').length,
                alumnos_sin_tutor: students.filter((s: Student) => s.status_asignacion === 'Sin asignar').length,
                canalizaciones_pendientes: 0
            };
        }
    }
}; 
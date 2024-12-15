import { Student, Tutor, Career } from '@/types';

const initialStudents: Student[] = [
    {
        id_alumno: 1,
        no_control: "19141234",
        nombre_completo: "Juan Pérez González",
        nombre_carrera: "Ingeniería en Sistemas Computacionales",
        estatus: "Regular",
        calificacion_tutorias: 85,
        nivel_tutoria: "Básico",
        semestre_actual: 1,
        tutor_asignado: "Sin asignar",
        status_asignacion: "Pendiente",
        motivo: null,
        id_carrera: 1
    },
    // Agrega más estudiantes demo aquí
];

const initialTutors: Tutor[] = [
    {
        id_tutor: 1,
        nombre_completo: "Dr. Luis Martínez",
        estatus: "Activo",
        num_estudiantes: 0,
        motivo: "Asignación inicial"
    },
    // Agrega más tutores demo aquí
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
    // Agrega más carreras demo aquí
];

export const initializeDemoData = () => {
    // Inicializar datos solo si no existen
    if (!localStorage.getItem('demo_students')) {
        localStorage.setItem('demo_students', JSON.stringify(initialStudents));
    }
    if (!localStorage.getItem('demo_tutors')) {
        localStorage.setItem('demo_tutors', JSON.stringify(initialTutors));
    }
    if (!localStorage.getItem('demo_careers')) {
        localStorage.setItem('demo_careers', JSON.stringify(initialCareers));
    }
};

export const getDemoStudents = () => {
    return JSON.parse(localStorage.getItem('demo_students') || '[]');
};

export const getDemoTutors = () => {
    return JSON.parse(localStorage.getItem('demo_tutors') || '[]');
};

export const getDemoCareers = () => {
    return JSON.parse(localStorage.getItem('demo_careers') || '[]');
}; 
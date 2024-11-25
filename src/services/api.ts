import axios from 'axios';
import { API_URL } from '@/config';
import { Student, Tutor, Statistics, Career, PeriodStatistics } from '@/types';

// Configuración base de axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Clase para manejar el estado de la caché
class CacheManager {
    private static cache: Map<string, { data: any; timestamp: number }> = new Map();
    private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    static set(key: string, data: any) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    static get(key: string) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }

    static clear() {
        this.cache.clear();
    }
}

// Servicios de API
export const apiService = {
    // Estudiantes
    students: {
        getAll: async (): Promise<Student[]> => {
            const cached = CacheManager.get('students');
            if (cached) return cached;

            const response = await api.get('/api/students');
            CacheManager.set('students', response.data);
            return response.data;
        },

        assign: async (tutorId: number, studentIds: number[], motivo: string) => {
            const response = await api.post('/api/assign-tutor', {
                tutorId,
                studentIds,
                motivo
            });
            CacheManager.clear();
            return response.data;
        },
    },

    // Tutores
    tutors: {
        getAll: async (): Promise<Tutor[]> => {
            const cached = CacheManager.get('tutors');
            if (cached) return cached;

            const response = await api.get('/api/tutors');
            CacheManager.set('tutors', response.data);
            return response.data;
        },
    },

    // Estadísticas
    statistics: {
        getAll: async (): Promise<Statistics[]> => {
            const cached = CacheManager.get('statistics');
            if (cached) return cached;

            const response = await api.get('/api/statistics');
            CacheManager.set('statistics', response.data);
            return response.data;
        },
    },

    //periods-statistics
    periodsStatistics: {
        getAll: async (): Promise<PeriodStatistics[]> => {
            const cached = CacheManager.get('periods-statistics');
            if (cached) return cached;

            const response = await api.get('/api/periods-statistics');
            CacheManager.set('periods-statistics', response.data);
            return response.data;
        },
    },

    //tutor-students
    tutorStudents: {
        getAll: async (tutorId: number): Promise<Student[]> => {
            const response = await api.get(`/api/tutor/${tutorId}/students`);
            return response.data;
        },
    },

    // Carreras
    careers: {
        getAll: async (): Promise<Career[]> => {
            const cached = CacheManager.get('careers');
            if (cached) return cached

            const response = await api.get('/api/careers');
            CacheManager.set('careers', response.data)
            return response.data;
        },
    },

    // Configuración de base de datos
    database: {
        configure: async (config: any) => {
            const response = await api.post('/api/configure', config);
            return response.data;
        },
    },

    // Método para refrescar datos
    refreshData: () => {
        CacheManager.clear();
    },
}; 
const isDevelopment = import.meta.env.DEV;
const VITE_API_URL = import.meta.env.VITE_API_URL;

export const API_URL = isDevelopment
    ? 'http://localhost:4321'
    : VITE_API_URL || 'https://tu-backend-url.com';

export const DB_CONFIG_KEY = 'db_config';

export const CONFIG = {
    APP_NAME: 'Sistema de Tutorías',
    VERSION: '1.0.0',
    ENV: import.meta.env.MODE,
}; 
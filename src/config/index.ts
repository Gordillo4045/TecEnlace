const isDevelopment = import.meta.env.DEV;

export const API_URL = isDevelopment
    ? 'http://localhost:4321'
    : 'https://tenenlace-server.up.railway.app/';

export const DB_CONFIG_KEY = 'db_config';

export const CONFIG = {
    APP_NAME: 'Sistema de Tutorías',
    VERSION: '1.0.0',
    ENV: import.meta.env.MODE,
}; 
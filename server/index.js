const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const app = express();

// Configuración de CORS
const allowedOrigins = [
    'https://amazing-scone-68c5ca.netlify.app', // Tu dominio de Netlify
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Aplicar CORS antes de cualquier ruta
app.use(cors(corsOptions));

// Middleware para preflight requests
app.options('*', cors(corsOptions));

// Middleware para debugging (temporal)
app.use((req, res, next) => {
    console.log('Request from:', req.headers.origin);
    console.log('Request method:', req.method);
    next();
});

app.use(express.json({ charset: 'utf-8' }));
app.use(bodyParser.json());

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
}

let pool = null;

const checkConnection = (req, res, next) => {
    if (!pool) {
        return res.status(400).json({ error: 'Base de datos no configurada' });
    }
    next();
};

// Configuración de la conexión a SQL Server
app.post('/api/configure', async (req, res) => {
    const { user, password, server, database } = req.body;

    if (!user || !password || !server || !database) {
        return res.status(400).json({ error: 'Faltan parámetros de conexión' });
    }

    const dbConfig = {
        user,
        password,
        server,
        database,
        options: {
            encrypt: true,
            trustServerCertificate: true,
            enableArithAbort: true,
            charset: 'UTF-8'
        },
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };

    try {
        if (pool) {
            await pool.close();
        }
        pool = await new sql.ConnectionPool(dbConfig).connect();

        // Configurar reconexión automática
        pool.on('error', async (err) => {
            console.error('Error en la conexión:', err);
            try {
                if (pool) {
                    await pool.close();
                }
                pool = await new sql.ConnectionPool(dbConfig).connect();
                console.log('Reconexión exitosa');
            } catch (reconnectErr) {
                console.error('Error en la reconexión:', reconnectErr);
            }
        });

        res.json({ message: 'Conexión establecida exitosamente' });
    } catch (err) {
        res.status(500).json({ error: `Error al conectar: ${err.message}` });
    }
});

// Agregar endpoint para verificar conexión
app.get('/api/check-connection', async (req, res) => {
    if (!pool || !pool.connected) {
        res.status(400).json({ connected: false });
        return;
    }
    res.json({ connected: true });
});

// Obtener estudiantes con información detallada
app.get('/api/students', checkConnection, async (req, res) => {
    try {
        const result = await pool.request().query(`
            SELECT 
                a.id_alumno,
                a.no_control,
                a.nombre + ' ' + a.apellidos COLLATE Modern_Spanish_CI_AI as nombre_completo,
                c.nombre_carrera COLLATE Modern_Spanish_CI_AI as nombre_carrera,
                a.estatus,
                a.calificacion_tutorias,
                nt.nivel COLLATE Modern_Spanish_CI_AI as nivel_tutoria,
                pi.semestre_actual,
                COALESCE(t.nombre_completo COLLATE Modern_Spanish_CI_AI, 'Sin asignar') as tutor_asignado,
                CASE 
                    WHEN t.id_tutor IS NULL THEN 'Sin asignar'
                    ELSE 'Asignado'
                END as status_asignacion,
                a.motivo COLLATE Modern_Spanish_CI_AI as motivo
            FROM Alumnos a
            LEFT JOIN Carreras c ON a.id_carrera = c.id_carrera
            LEFT JOIN Niveles_Tutorias nt ON a.id_nivel = nt.id_nivel
            LEFT JOIN Periodo_Ingreso pi ON a.id_ingreso = pi.id_ingreso
            LEFT JOIN Asignaciones_Tutores_Alumnos ata ON a.id_alumno = ata.id_alumno AND ata.estado = 'Activo'
            LEFT JOIN Tutores t ON ata.id_tutor = t.id_tutor
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener tutores con estadísticas
app.get('/api/tutors', checkConnection, async (req, res) => {
    try {
        const result = await pool.request().query(`
            SELECT 
                t.id_tutor,
                t.nombre_completo,
                t.estatus,
                t.motivo,
                COUNT(DISTINCT ata.id_alumno) as num_estudiantes
            FROM Tutores t
            LEFT JOIN Asignaciones_Tutores_Alumnos ata ON t.id_tutor = ata.id_tutor AND ata.estado = 'Activo'
            GROUP BY t.id_tutor, t.nombre_completo, t.estatus, t.motivo
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener estadísticas generales
app.get('/api/statistics', checkConnection, async (req, res) => {
    try {
        const result = await pool.request().query(`
            SELECT 
                c.nombre_carrera,
                COUNT(DISTINCT a.id_alumno) as total_alumnos,
                AVG(a.calificacion_tutorias) as promedio_calificacion_tutorias,
                COUNT(DISTINCT ata.id_tutor) as total_tutores
            FROM Carreras c
            LEFT JOIN Alumnos a ON c.id_carrera = a.id_carrera
            LEFT JOIN Asignaciones_Tutores_Alumnos ata ON a.id_alumno = ata.id_alumno AND ata.estado = 'Activo'
            GROUP BY c.nombre_carrera
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Asignar tutor a estudiantes
app.post('/api/assign-tutor', checkConnection, async (req, res) => {
    const { tutorId, studentIds, motivo } = req.body;

    try {
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            for (const studentId of studentIds) {
                await transaction.request()
                    .input('studentId', sql.Int, studentId)
                    .query(`
                        UPDATE Asignaciones_Tutores_Alumnos 
                        SET estado = 'Inactivo', 
                            fecha_fin = GETDATE() 
                        WHERE id_alumno = @studentId AND estado = 'Activo'
                    `);

                await transaction.request()
                    .input('studentId', sql.Int, studentId)
                    .input('tutorId', sql.Int, tutorId)
                    .input('motivo', sql.NVarChar, motivo)
                    .query(`
                        INSERT INTO Asignaciones_Tutores_Alumnos 
                        (id_alumno, id_tutor, fecha_asignacion, estado, motivo_cambio)
                        VALUES (@studentId, @tutorId, GETDATE(), 'Activo', @motivo)
                    `);
            }

            await transaction.commit();
            res.json({ message: 'Asignaciones realizadas exitosamente' });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.error('Error en la asignación:', err);
        res.status(500).json({
            error: 'Error al realizar las asignaciones',
            details: err.message
        });
    }
});

// Obtener carreras
app.get('/api/careers', checkConnection, async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM Carreras');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener alumnos asignados a un tutor
app.get('/api/tutor/:tutorId/students', checkConnection, async (req, res) => {
    try {
        const result = await pool.request()
            .input('tutorId', sql.Int, req.params.tutorId)
            .query(`
                SELECT 
                    a.id_alumno,
                    a.no_control,
                    a.nombre + ' ' + a.apellidos COLLATE Modern_Spanish_CI_AI as nombre_completo,
                    c.nombre_carrera COLLATE Modern_Spanish_CI_AI as nombre_carrera,
                    a.estatus,
                    a.calificacion_tutorias,
                    nt.nivel COLLATE Modern_Spanish_CI_AI as nivel_tutoria,
                    pi.semestre_actual,
                    ata.fecha_asignacion,
                    ata.motivo_cambio COLLATE Modern_Spanish_CI_AI as motivo_asignacion
                FROM Alumnos a
                INNER JOIN Asignaciones_Tutores_Alumnos ata ON a.id_alumno = ata.id_alumno
                LEFT JOIN Carreras c ON a.id_carrera = c.id_carrera
                LEFT JOIN Niveles_Tutorias nt ON a.id_nivel = nt.id_nivel
                LEFT JOIN Periodo_Ingreso pi ON a.id_ingreso = pi.id_ingreso
                WHERE ata.id_tutor = @tutorId 
                AND ata.estado = 'Activo'
            `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener estadísticas del período actual
app.get('/api/period-statistics', checkConnection, async (req, res) => {
    try {
        const result = await pool.request().query(`
            WITH PeriodoActual AS (
                SELECT TOP 1 id_periodo, fecha_inicio, fecha_fin
                FROM Tutorias_Periodo
                WHERE fecha_fin >= GETDATE()
                ORDER BY fecha_inicio DESC
            )
            SELECT 
                (SELECT COUNT(DISTINCT a.id_alumno) 
                 FROM Alumnos a 
                 WHERE a.estatus = 'Activo') as total_alumnos,
                
                (SELECT COUNT(DISTINCT id_tutor) 
                 FROM Tutores 
                 WHERE estatus = 'Activo') as total_tutores,
                
                (SELECT COUNT(id_entrevista) 
                 FROM Entrevistas e 
                 JOIN PeriodoActual p ON e.fecha_entrevista BETWEEN p.fecha_inicio AND p.fecha_fin) as total_entrevistas,
                
                (SELECT COUNT(id_canalizacion) 
                 FROM Canalizaciones c 
                 JOIN PeriodoActual p ON c.fecha_canalizacion BETWEEN p.fecha_inicio AND p.fecha_fin) as total_canalizaciones,
                
                (SELECT AVG(calificacion_tutorias) 
                 FROM Alumnos 
                 WHERE estatus = 'Activo') as promedio_calificaciones,
                
                (SELECT COUNT(DISTINCT id_alumno) 
                 FROM Asignaciones_Tutores_Alumnos 
                 WHERE estado = 'Activo') as alumnos_con_tutor,
                
                (SELECT COUNT(DISTINCT id_alumno) 
                 FROM Alumnos a 
                 WHERE NOT EXISTS (
                     SELECT 1 FROM Asignaciones_Tutores_Alumnos ata 
                     WHERE ata.id_alumno = a.id_alumno AND ata.estado = 'Activo'
                 ) AND a.estatus = 'Activo') as alumnos_sin_tutor,

                (SELECT COUNT(id_canalizacion) 
                 FROM Canalizaciones 
                 WHERE estatus = 'Pendiente') as canalizaciones_pendientes
        `);

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Configuración del rate limiter
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW), // 15 minutos por defecto
    max: parseInt(process.env.RATE_LIMIT_MAX) // límite de peticiones por ventana
});

// Usar el rate limiter
app.use(limiter);

const PORT = process.env.PORT || 4321;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en puerto ${PORT} en modo ${process.env.NODE_ENV}`);
});
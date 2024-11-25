const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json({ charset: 'utf-8' }));
app.use(cors());
app.use(bodyParser.json());

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
        res.json({ message: 'Conexión establecida exitosamente' });
    } catch (err) {
        res.status(500).json({ error: `Error al conectar: ${err.message}` });
    }
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
                COUNT(DISTINCT ata.id_alumno) as num_estudiantes
            FROM Tutores t
            LEFT JOIN Asignaciones_Tutores_Alumnos ata ON t.id_tutor = ata.id_tutor AND ata.estado = 'Activo'
            GROUP BY t.id_tutor, t.nombre_completo, t.estatus
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
                // Desactivar asignaciones anteriores
                await transaction.request()
                    .input('studentId', sql.Int, studentId)
                    .query(`
                        UPDATE Asignaciones_Tutores_Alumnos 
                        SET estado = 'Inactivo', 
                            fecha_fin = GETDATE() 
                        WHERE id_alumno = @studentId AND estado = 'Activo'
                    `);

                // Crear nueva asignación con motivo
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



const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Obtener todos los alumnos
router.get('/', async (req, res) => {
    try {
        const result = await req.pool.request().query(`
            SELECT 
                a.*,
                c.nombre_carrera,
                nt.nivel as nivel_tutoria,
                pi.semestre_actual,
                COALESCE(t.nombre_completo, 'Sin asignar') as tutor_actual,
                'ISIC-2010-224' as paquete_inscrito
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

// Crear nuevo alumno
router.post('/', async (req, res) => {
    const { no_control, nombre, apellidos, id_carrera, estatus, calificacion_tutorias, etapa_tutorias, id_nivel } = req.body;

    try {
        const result = await req.pool.request()
            .input('no_control', sql.NVarChar, no_control)
            .input('nombre', sql.NVarChar, nombre)
            .input('apellidos', sql.NVarChar, apellidos)
            .input('id_carrera', sql.Int, id_carrera)
            .input('estatus', sql.NVarChar, estatus)
            .input('calificacion_tutorias', sql.Decimal(5, 2), calificacion_tutorias)
            .input('etapa_tutorias', sql.Int, etapa_tutorias)
            .input('id_nivel', sql.Int, id_nivel)
            .query(`
                INSERT INTO Alumnos (no_control, nombre, apellidos, id_carrera, estatus, calificacion_tutorias, etapa_tutorias, id_nivel)
                VALUES (@no_control, @nombre, @apellidos, @id_carrera, @estatus, @calificacion_tutorias, @etapa_tutorias, @id_nivel);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        res.status(201).json({ id: result.recordset[0].id, message: 'Alumno creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar alumno
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { no_control, nombre, apellidos, id_carrera, estatus, calificacion_tutorias, etapa_tutorias, id_nivel } = req.body;

    try {
        await req.pool.request()
            .input('id', sql.Int, id)
            .input('no_control', sql.NVarChar, no_control)
            .input('nombre', sql.NVarChar, nombre)
            .input('apellidos', sql.NVarChar, apellidos)
            .input('id_carrera', sql.Int, id_carrera)
            .input('estatus', sql.NVarChar, estatus)
            .input('calificacion_tutorias', sql.Decimal(5, 2), calificacion_tutorias)
            .input('etapa_tutorias', sql.Int, etapa_tutorias)
            .input('id_nivel', sql.Int, id_nivel)
            .query(`
                UPDATE Alumnos 
                SET no_control = @no_control,
                    nombre = @nombre,
                    apellidos = @apellidos,
                    id_carrera = @id_carrera,
                    estatus = @estatus,
                    calificacion_tutorias = @calificacion_tutorias,
                    etapa_tutorias = @etapa_tutorias,
                    id_nivel = @id_nivel
                WHERE id_alumno = @id
            `);

        res.json({ message: 'Alumno actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 
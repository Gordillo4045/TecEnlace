const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Obtener todas las entrevistas
router.get('/', async (req, res) => {
    try {
        const result = await req.pool.request().query(`
            SELECT 
                e.*,
                a.nombre + ' ' + a.apellidos as nombre_alumno,
                t.nombre_completo as nombre_tutor
            FROM Entrevistas e
            JOIN Alumnos a ON e.id_alumno = a.id_alumno
            JOIN Tutores t ON e.id_tutor = t.id_tutor
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear nueva entrevista
router.post('/', async (req, res) => {
    const { id_alumno, id_tutor, observaciones, recomendacion } = req.body;

    try {
        const result = await req.pool.request()
            .input('id_alumno', sql.Int, id_alumno)
            .input('id_tutor', sql.Int, id_tutor)
            .input('fecha_entrevista', sql.Date, new Date())
            .input('observaciones', sql.NVarChar, observaciones)
            .input('recomendacion', sql.NVarChar, recomendacion)
            .query(`
                INSERT INTO Entrevistas (id_alumno, id_tutor, fecha_entrevista, observaciones, recomendacion)
                VALUES (@id_alumno, @id_tutor, @fecha_entrevista, @observaciones, @recomendacion);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        res.status(201).json({ id: result.recordset[0].id, message: 'Entrevista creada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 
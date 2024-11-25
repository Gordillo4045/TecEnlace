const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Obtener todos los tutores con estadísticas
router.get('/', async (req, res) => {
    try {
        const result = await req.pool.request().query(`
            SELECT 
                t.*,
                COUNT(DISTINCT ata.id_alumno) as total_alumnos_activos
            FROM Tutores t
            LEFT JOIN Asignaciones_Tutores_Alumnos ata 
                ON t.id_tutor = ata.id_tutor 
                AND ata.estado = 'Activo'
            GROUP BY t.id_tutor, t.nombre_completo, t.estatus, t.motivo
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear nuevo tutor
router.post('/', async (req, res) => {
    const { nombre_completo, estatus, motivo } = req.body;

    try {
        const result = await req.pool.request()
            .input('nombre_completo', sql.NVarChar, nombre_completo)
            .input('estatus', sql.NVarChar, estatus)
            .input('motivo', sql.NVarChar, motivo)
            .query(`
                INSERT INTO Tutores (nombre_completo, estatus, motivo)
                VALUES (@nombre_completo, @estatus, @motivo);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        res.status(201).json({ id: result.recordset[0].id, message: 'Tutor creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Pool de conexión global
let pool = null;

// Middleware para verificar conexión
const checkConnection = (req, res, next) => {
    if (!pool) {
        return res.status(400).json({ error: 'Base de datos no configurada' });
    }
    next();
};

// Middleware para validar datos de items
const validateItemData = (req, res, next) => {
    const { name, description } = req.body;
    if (!name || typeof name !== 'string' || name.length > 100) {
        return res.status(400).json({ error: 'Nombre inválido' });
    }
    if (description && typeof description !== 'string' || description?.length > 500) {
        return res.status(400).json({ error: 'Descripción inválida' });
    }
    next();
};

// Configuración de la conexión a SQL Server
app.post('/api/configure', async (req, res) => {
    const { user, password, server, database } = req.body;

    // Validar parámetros de conexión
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
            enableArithAbort: true
        },
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };

    try {
        // Cerrar pool existente si existe
        if (pool) {
            await pool.close();
        }

        // Crear nuevo pool
        pool = await new sql.ConnectionPool(dbConfig).connect();
        res.json({ message: 'Conexión establecida exitosamente' });
    } catch (err) {
        res.status(500).json({ error: `Error al conectar: ${err.message}` });
    }
});

// Rutas CRUD
app.get('/api/items', checkConnection, async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM Items');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/items', [checkConnection, validateItemData], async (req, res) => {
    const { name, description } = req.body;
    try {
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description || null)
            .query('INSERT INTO Items (name, description) VALUES (@name, @description)');
        res.status(201).json({ message: 'Item creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/items/:id', [checkConnection, validateItemData], async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description || null)
            .query('UPDATE Items SET name = @name, description = @description WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }

        res.json({ message: 'Item actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/items/:id', checkConnection, async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Items WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }

        res.json({ message: 'Item eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Cleanup al cerrar la aplicación
process.on('SIGINT', async () => {
    if (pool) {
        await pool.close();
    }
    process.exit();
});

const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
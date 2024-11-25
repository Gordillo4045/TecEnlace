-- Crear la base de datos (opcional, depende del entorno)
CREATE DATABASE DepartamentoTutorias;
GO
USE DepartamentoTutorias;
GO

-- Tabla: Carreras
CREATE TABLE Carreras (
    id_carrera INT PRIMARY KEY,
    nombre_carrera NVARCHAR(100) NOT NULL
);
GO

-- Tabla: Niveles_Tutorias
CREATE TABLE Niveles_Tutorias (
    id_nivel INT PRIMARY KEY,
    nivel NVARCHAR(50) NOT NULL
);
GO

-- Insertar los niveles
INSERT INTO Niveles_Tutorias (id_nivel, nivel) VALUES (1, N'Inducción');
GO
INSERT INTO Niveles_Tutorias (id_nivel, nivel) VALUES (2, N'Acompañamiento');
GO
INSERT INTO Niveles_Tutorias (id_nivel, nivel) VALUES (3, N'Inserción Laboral');
GO

-- Tabla: Alumnos
CREATE TABLE Alumnos (
    id_alumno INT PRIMARY KEY,
    no_control NVARCHAR(10) UNIQUE NOT NULL,
    nombre NVARCHAR(50) NOT NULL,
    apellidos NVARCHAR(50) NOT NULL,
    id_carrera INT,
    estatus NVARCHAR(10) DEFAULT 'Activo',
    motivo NVARCHAR(MAX),
    calificacion_tutorias DECIMAL(5,2),
    etapa_tutorias INT,
    id_nivel INT,
    id_ingreso INT,
    FOREIGN KEY (id_carrera) REFERENCES Carreras(id_carrera),
    FOREIGN KEY (id_nivel) REFERENCES Niveles_Tutorias(id_nivel)
);
GO

-- Tabla: Periodo_Ingreso
CREATE TABLE Periodo_Ingreso (
    id_ingreso INT PRIMARY KEY,
    id_alumno INT,
    fecha_ingreso DATE NOT NULL,
    semestre_actual INT,
    FOREIGN KEY (id_alumno) REFERENCES Alumnos(id_alumno)
);
GO

-- Tabla: Tutores
CREATE TABLE Tutores (
    id_tutor INT PRIMARY KEY,
    nombre_completo NVARCHAR(100) NOT NULL,
    estatus NVARCHAR(10) DEFAULT 'Activo',
    motivo NVARCHAR(MAX)
);
GO

-- Tabla: Historial_Tutores
CREATE TABLE Historial_Tutores (
    id_historial INT PRIMARY KEY,
    id_alumno INT,
    id_tutor INT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    motivo_cambio NVARCHAR(MAX),
    FOREIGN KEY (id_alumno) REFERENCES Alumnos(id_alumno),
    FOREIGN KEY (id_tutor) REFERENCES Tutores(id_tutor)
);
GO

-- Tabla: Tutorias
CREATE TABLE Tutorias (
    id_tutoria INT PRIMARY KEY,
    id_alumno INT,
    id_tutor_actual INT,
    id_tutor_anterior INT,
    motivo_cambio NVARCHAR(MAX),
    fecha_cambio DATE,
    FOREIGN KEY (id_alumno) REFERENCES Alumnos(id_alumno),
    FOREIGN KEY (id_tutor_actual) REFERENCES Tutores(id_tutor),
    FOREIGN KEY (id_tutor_anterior) REFERENCES Tutores(id_tutor)
);
GO

-- Tabla: Entrevistas
CREATE TABLE Entrevistas (
    id_entrevista INT PRIMARY KEY,
    id_alumno INT,
    id_tutor INT,
    fecha_entrevista DATE NOT NULL,
    observaciones NVARCHAR(MAX),
    recomendacion NVARCHAR(MAX),
    FOREIGN KEY (id_alumno) REFERENCES Alumnos(id_alumno),
    FOREIGN KEY (id_tutor) REFERENCES Tutores(id_tutor)
);
GO

-- Tabla: Canalizaciones
CREATE TABLE Canalizaciones (
    id_canalizacion INT PRIMARY KEY,
    id_entrevista INT,
    tipo_asesoria NVARCHAR(50),
    detalle_canalizacion NVARCHAR(MAX),
    fecha_canalizacion DATE,
    estatus NVARCHAR(50) DEFAULT 'Pendiente',
    FOREIGN KEY (id_entrevista) REFERENCES Entrevistas(id_entrevista)
);
GO

-- Tabla: Asignaciones_Tutorado
CREATE TABLE Asignaciones_Tutorado (
    id_asignacion INT PRIMARY KEY,
    no_oficio NVARCHAR(20) NOT NULL,
    departamento NVARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    tutor_nombre NVARCHAR(100) NOT NULL,
    alumno_control NVARCHAR(10) NOT NULL,
    alumno_nombre NVARCHAR(100) NOT NULL,
    duracion NVARCHAR(50),
    notas NVARCHAR(MAX),
    FOREIGN KEY (alumno_control) REFERENCES Alumnos(no_control)
);
GO

-- Tabla: Asignaciones_Tutores_Alumnos (Modificada con IDENTITY)
CREATE TABLE Asignaciones_Tutores_Alumnos (
    id_asignacion INT IDENTITY(1,1) PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_tutor INT NOT NULL,
    fecha_asignacion DATE NOT NULL,
    fecha_fin DATE NULL,
    estado NVARCHAR(50) DEFAULT N'Activo',
    motivo_cambio NVARCHAR(MAX),
    FOREIGN KEY (id_alumno) REFERENCES Alumnos(id_alumno),
    FOREIGN KEY (id_tutor) REFERENCES Tutores(id_tutor)
);
GO

-- Tabla: Tutorias_Periodo
CREATE TABLE Tutorias_Periodo (
    id_periodo INT PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    seguimiento TEXT,
    id_tutor INT,
    id_asignacion INT,
    id_alumno INT,
    FOREIGN KEY (id_tutor) REFERENCES Tutores(id_tutor),
    FOREIGN KEY (id_asignacion) REFERENCES Asignaciones_Tutorado(id_asignacion),
    FOREIGN KEY (id_alumno) REFERENCES Alumnos(id_alumno)
);
GO

-- Insertar registros en la tabla Carreras
INSERT INTO Carreras (id_carrera, nombre_carrera) VALUES
(1, N'Ingeniería en Sistemas Computacionales'),
(2, N'Ingeniería Industrial'),
(3, N'Ingeniería Civil'),
(4, N'Licenciatura en Administración');
GO

-- Insertar registros en la tabla Alumnos
INSERT INTO Alumnos (id_alumno, no_control, nombre, apellidos, id_carrera, estatus, motivo, calificacion_tutorias, etapa_tutorias, id_nivel, id_ingreso) VALUES
(1, N'C20210101', N'Juan', N'Pérez García', 1, N'Activo', NULL, 85.50, 1, 1, 1),
(2, N'C20210202', N'María', N'López Rodríguez', 2, N'Activo', NULL, 90.75, 2, 2, 2),
(3, N'C20210303', N'Carlos', N'Hernández Martínez', 3, N'Inactivo', N'Cambio de carrera', 78.40, 3, 3, 3),
(4, N'C20210404', N'Ana', N'Gómez Sánchez', 4, N'Activo', NULL, 88.90, 1, 1, 4);
GO

-- Insertar registros en la tabla Periodo_Ingreso
INSERT INTO Periodo_Ingreso (id_ingreso, id_alumno, fecha_ingreso, semestre_actual) VALUES
(1, 1, '2021-08-15', 4),
(2, 2, '2021-08-15', 4),
(3, 3, '2021-08-15', 4),
(4, 4, '2021-08-15', 4);
GO
-- Insertar registros en la tabla Tutores
INSERT INTO Tutores (id_tutor, nombre_completo, estatus, motivo) VALUES
(1, N'Luis Fernández', N'Activo', NULL),
(2, N'José Ramírez', N'Activo', NULL),
(3, N'Marta Gómez', N'Inactivo', N'Licencia médica'),
(4, N'Elena Rodríguez', N'Activo', NULL);
GO

-- Insertar registros en la tabla Historial_Tutores
INSERT INTO Historial_Tutores (id_historial, id_alumno, id_tutor, fecha_inicio, fecha_fin, motivo_cambio) VALUES
(1, 1, 1, '2021-09-01', '2022-06-30', 'Cambio de tutor'),
(2, 2, 2, '2021-09-01', NULL, NULL),
(3, 3, 3, '2021-09-01', '2022-06-30', N'Licencia médica'),
(4, 4, 4, '2021-09-01', NULL, NULL);
GO

-- Insertar registros en la tabla Tutorias
INSERT INTO Tutorias (id_tutoria, id_alumno, id_tutor_actual, id_tutor_anterior, motivo_cambio, fecha_cambio) VALUES
(1, 1, 2, 1, N'Cambio de tutor por ajuste de horario', N'2022-07-01'),
(2, 3, 4, 3, N'Asignación de nuevo tutor', N'2022-07-01');
GO

-- Insertar registros en la tabla Entrevistas
INSERT INTO Entrevistas (id_entrevista, id_alumno, id_tutor, fecha_entrevista, observaciones, recomendacion) VALUES
(1, 1, 2, '2022-01-15', N'Alumno con buen desempeño', N'Continuar igual'),
(2, 2, 2, '2022-01-15', N'Necesita apoyo en matemáticas', N'Asesoría adicional'),
(3, 3, 4, '2022-01-15', N'Dificultades en varias materias', N'Terapia psicológica'),
(4, 4, 4, '2022-01-15', N'Alumno sobresaliente', N'Participar en concursos académicos');
GO

-- Insertar registros en la tabla Canalizaciones
INSERT INTO Canalizaciones (id_canalizacion, id_entrevista, tipo_asesoria, detalle_canalizacion, fecha_canalizacion, estatus) VALUES
(1, 2, N'Asesoría académica', N'Matemáticas avanzadas', N'2022-02-01', N'Pendiente'),
(2, 3, N'Terapia psicológica', N'Evaluación inicial', N'2022-02-01', N'Pendiente');
GO

-- Insertar registros en la tabla Asignaciones_Tutorado
INSERT INTO Asignaciones_Tutorado (id_asignacion, no_oficio, departamento, fecha, tutor_nombre, alumno_control, alumno_nombre, duracion, notas) VALUES
(1, N'OFI20211001', N'Depto. de Sistemas', N'2021-09-01', N'Luis Fernández', N'C20210101', N'Juan Pérez García', N'2 años', N'Asignado por rendimiento académico'),
(2, N'OFI20211002', N'Depto. de Industrial', N'2021-09-01', N'José Ramírez', N'C20210202', N'María López Rodríguez', N'2 años', N'Asignado por solicitud del alumno');
GO

-- Insertar registros en la tabla Tutorias_Periodo
INSERT INTO Tutorias_Periodo (id_periodo, fecha_inicio, fecha_fin, seguimiento, id_tutor, id_asignacion, id_alumno) VALUES
(1, '2021-09-01', '2022-06-30', 'Seguimiento mensual', 1, 1, 1),
(2, '2021-09-01', '2022-06-30', 'Seguimiento trimestral', 2, 2, 2);
GO

-- Crear la tabla Clasificaciones_Grupos
CREATE TABLE Clasificaciones_Grupos (
    id_clasificacion INT PRIMARY KEY,
    id_alumno INT,
    grupo VARCHAR(50),
    FOREIGN KEY (id_alumno) REFERENCES Alumnos(id_alumno)
);
GO

-- Insertar registros en la tabla Clasificaciones_Grupos
INSERT INTO Clasificaciones_Grupos (id_clasificacion, id_alumno, grupo) VALUES
(1, 1, 'Grupo A'),
(2, 2, 'Grupo B'),
(3, 3, 'Grupo C'),
(4, 4, 'Grupo A');
GO

-- Crear la vista para obtener promedios de calificaciones por grupo
CREATE VIEW Promedios_Grupos AS
SELECT cg.grupo, AVG(a.calificacion_tutorias) AS promedio_calificacion
FROM Alumnos a
JOIN Clasificaciones_Grupos cg ON a.id_alumno = cg.id_alumno
GROUP BY cg.grupo;
GO

-- Consultas
SELECT * FROM Alumnos WHERE calificacion_tutorias > 85;
GO

SELECT * FROM Tutores WHERE estatus = 'Activo';
GO

SELECT * FROM Entrevistas WHERE fecha_entrevista BETWEEN '2022-01-01' AND '2022-12-31';
GO

SELECT c.nombre_carrera, AVG(a.calificacion_tutorias) AS promedio_calificacion
FROM Alumnos a
JOIN Carreras c ON a.id_carrera = c.id_carrera
GROUP BY c.nombre_carrera;
GO

-- Crear la tabla Bitacora_Movimientos
CREATE TABLE Bitacora_Movimientos (
    id_bitacora INT PRIMARY KEY IDENTITY(1,1),
    tabla_modificada VARCHAR(100),
    tipo_movimiento VARCHAR(50),
    fecha_movimiento DATETIME DEFAULT GETDATE(),
    descripcion TEXT
);
GO

-- Triggers para la tabla Alumnos
CREATE TRIGGER tr_insert_alumnos
ON Alumnos
AFTER INSERT
AS
BEGIN
    INSERT INTO Bitacora_Movimientos (tabla_modificada, tipo_movimiento, fecha_movimiento, descripcion)
    VALUES ('Alumnos', 'INSERT', GETDATE(), CONCAT(N'Se insertó el alumno con ID ', (SELECT id_alumno FROM inserted)));
END;
GO

CREATE TRIGGER tr_update_alumnos
ON Alumnos
AFTER UPDATE
AS
BEGIN
    INSERT INTO Bitacora_Movimientos (tabla_modificada, tipo_movimiento, fecha_movimiento, descripcion)
    VALUES ('Alumnos', 'UPDATE', GETDATE(), CONCAT(N'Se actualizó el alumno con ID ', (SELECT id_alumno FROM inserted)));
END;
GO

CREATE TRIGGER tr_delete_alumnos
ON Alumnos
AFTER DELETE
AS
BEGIN
    INSERT INTO Bitacora_Movimientos (tabla_modificada, tipo_movimiento, fecha_movimiento, descripcion)
    VALUES ('Alumnos', 'DELETE', GETDATE(), CONCAT(N'Se eliminó el alumno con ID ', (SELECT id_alumno FROM deleted)));
END;
GO

-- Triggers para la tabla Tutores
CREATE TRIGGER tr_insert_tutores
ON Tutores
AFTER INSERT
AS
BEGIN
    INSERT INTO Bitacora_Movimientos (tabla_modificada, tipo_movimiento, fecha_movimiento, descripcion)
    VALUES ('Tutores', 'INSERT', GETDATE(), CONCAT(N'Se insertó el tutor con ID ', (SELECT id_tutor FROM inserted)));
END;
GO

CREATE TRIGGER tr_update_tutores
ON Tutores
AFTER UPDATE
AS
BEGIN
    INSERT INTO Bitacora_Movimientos (tabla_modificada, tipo_movimiento, fecha_movimiento, descripcion)
    VALUES ('Tutores', 'UPDATE', GETDATE(), CONCAT(N'Se actualizó el tutor con ID ', (SELECT id_tutor FROM inserted)));
END;
GO

CREATE TRIGGER tr_delete_tutores
ON Tutores
AFTER DELETE
AS
BEGIN
    INSERT INTO Bitacora_Movimientos (tabla_modificada, tipo_movimiento, fecha_movimiento, descripcion)
    VALUES ('Tutores', 'DELETE', GETDATE(), CONCAT(N'Se eliminó el tutor con ID ', (SELECT id_tutor FROM deleted)));
END;
GO


--PIVOTS
-- 1. Cantidad de alumnos por tutor, clasificados por estatus (Activo/Inactivo).
-- Este PIVOT muestra cuántos alumnos están activos e inactivos bajo cada tutor.
SELECT nombre_completo AS Tutor, [Activo], [Inactivo]
FROM (
    SELECT t.nombre_completo, a.estatus
    FROM Tutores t
    JOIN Historial_Tutores ht ON t.id_tutor = ht.id_tutor
    JOIN Alumnos a ON ht.id_alumno = a.id_alumno
) AS SourceTable
PIVOT (
    COUNT(estatus) FOR estatus IN ([Activo], [Inactivo])
) AS PivotTable;
GO

-- 2. Promedio de calificaciones por tutor y nivel de tutoría.
-- Este PIVOT calcula el promedio de calificaciones de los alumnos según su tutor y el nivel de tutoría (Inducción, Acompañamiento, Inserción Laboral).
SELECT nombre_completo AS Tutor, [Inducción], [Acompañamiento], [Inserción Laboral]
FROM (
    SELECT t.nombre_completo, nt.nivel, a.calificacion_tutorias
    FROM Tutores t
    JOIN Historial_Tutores ht ON t.id_tutor = ht.id_tutor
    JOIN Alumnos a ON ht.id_alumno = a.id_alumno
    JOIN Niveles_Tutorias nt ON a.id_nivel = nt.id_nivel
) AS SourceTable
PIVOT (
    AVG(calificacion_tutorias) FOR nivel IN ([Inducción], [Acompañamiento], [Inserción Laboral])
) AS PivotTable;
GO

-- 3. Número de entrevistas realizadas por tutor y grupo de alumnos.
-- Este PIVOT cuenta cuántas entrevistas realizó cada tutor, agrupadas por los diferentes grupos de alumnos (Grupo A, Grupo B, Grupo C).
SELECT nombre_completo AS Tutor, [Grupo A], [Grupo B], [Grupo C]
FROM (
    SELECT t.nombre_completo, cg.grupo
    FROM Tutores t
    JOIN Entrevistas e ON t.id_tutor = e.id_tutor
    JOIN Clasificaciones_Grupos cg ON e.id_alumno = cg.id_alumno
) AS SourceTable
PIVOT (
    COUNT(grupo) FOR grupo IN ([Grupo A], [Grupo B], [Grupo C])
) AS PivotTable;
GO

-- 4. Estado de alumnos (activo o inactivo) por carrera y tutor asignado.
-- Este PIVOT muestra la cantidad de alumnos activos e inactivos para cada tutor, agrupados por la carrera de los alumnos.
SELECT nombre_completo AS Tutor, [Activo], [Inactivo]
FROM (
    SELECT t.nombre_completo, a.estatus
    FROM Alumnos a
    JOIN Asignaciones_Tutores_Alumnos ata ON a.id_alumno = ata.id_alumno
    JOIN Tutores t ON ata.id_tutor = t.id_tutor
) AS SourceTable
PIVOT (
    COUNT(estatus) FOR estatus IN ([Activo], [Inactivo])
) AS PivotTable;
GO
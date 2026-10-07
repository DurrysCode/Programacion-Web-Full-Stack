const express = require("express");
const { sql, poolPromise } = require("./db");

const app = express();
const cors = require("cors");
app.use(cors());

// Permite recibir informaciÃ³n en formato JSON
app.use(express.json());


// =====================================================
// METODO GET
// Consultar todos los alumnos
// =====================================================

app.get("/api/alumnos", async (req, res) => {

    try {

        // Obtener conexion a SQL Server
        const pool = await poolPromise;

        // Ejecutar SELECT
        const result = await pool.request()
            .query(`
                SELECT
                    IdAlumno,
                    Nombre,
                    Apellido,
                    Carnet,
                    Carrera,
                    Edad
                FROM Alumnos
            `);

        // Devolver resultado en formato JSON
        res.json(result.recordset);

    } catch (error) {

        console.error("Error al consultar:", error);

        res.status(500).json({
            mensaje: "Error al consultar los alumnos",
            error: error.message
        });
    }

});


// =====================================================
// MÃ‰TODO POST
// Insertar un nuevo alumno
// =====================================================

app.post("/api/alumnos", async (req, res) => {

    try {

        // Recibir datos enviados desde Postman
        const {
            Nombre,
            Apellido,
            Carnet,
            Carrera,
            Edad
        } = req.body;


        // Obtener conexiÃ³n a SQL Server
        const pool = await poolPromise;


        // Ejecutar INSERT
        await pool.request()

            .input("Nombre", sql.VarChar(50), Nombre)
            .input("Apellido", sql.VarChar(50), Apellido)
            .input("Carnet", sql.VarChar(20), Carnet)
            .input("Carrera", sql.VarChar(100), Carrera)
            .input("Edad", sql.Int, Edad)

            .query(`
                INSERT INTO Alumnos
                (
                    Nombre,
                    Apellido,
                    Carnet,
                    Carrera,
                    Edad
                )
                VALUES
                (
                    @Nombre,
                    @Apellido,
                    @Carnet,
                    @Carrera,
                    @Edad
                )
            `);


        // Respuesta al cliente
        res.status(201).json({
            mensaje: "Alumno insertado correctamente"
        });


    } catch (error) {

        console.error("Error al insertar:", error);

        res.status(500).json({
            mensaje: "Error al insertar el alumno",
            error: error.message
        });
    }

});


// =====================================================
// INICIAR SERVIDOR
// =====================================================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor ejecutandose en http://localhost:${PORT}`
    );

});

// =====================================================
// MÉTODO PUT
// Actualizar un alumno existente
// =====================================================

app.put("/api/alumnos/:id", async (req, res) => {

    try {

        // Obtener el ID desde los parámetros de la URL
        const { id } = req.params;

        // Recibir los datos actualizados desde el body
        const {
            Nombre,
            Apellido,
            Carnet,
            Carrera,
            Edad
        } = req.body;

        // Obtener conexión a SQL Server
        const pool = await poolPromise;

        // Ejecutar UPDATE
        const result = await pool.request()

            .input("IdAlumno", sql.Int, id)
            .input("Nombre", sql.VarChar(50), Nombre)
            .input("Apellido", sql.VarChar(50), Apellido)
            .input("Carnet", sql.VarChar(20), Carnet)
            .input("Carrera", sql.VarChar(100), Carrera)
            .input("Edad", sql.Int, Edad)

            .query(`
                UPDATE Alumnos
                SET
                    Nombre = @Nombre,
                    Apellido = @Apellido,
                    Carnet = @Carnet,
                    Carrera = @Carrera,
                    Edad = @Edad
                WHERE IdAlumno = @IdAlumno
            `);

        // Validar si el alumno existía y fue modificado
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado para actualizar"
            });
        }

        // Respuesta al cliente
        res.json({
            mensaje: "Alumno actualizado correctamente"
        });

    } catch (error) {

        console.error("Error al actualizar:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el alumno",
            error: error.message
        });
    }

});


// =====================================================
// MÉTODO DELETE
// Eliminar un alumno por su ID
// =====================================================

app.delete("/api/alumnos/:id", async (req, res) => {

    try {

        // Obtener el ID desde los parámetros de la URL
        const { id } = req.params;

        // Obtener conexión a SQL Server
        const pool = await poolPromise;

        // Ejecutar DELETE
        const result = await pool.request()

            .input("IdAlumno", sql.Int, id)

            .query(`
                DELETE FROM Alumnos
                WHERE IdAlumno = @IdAlumno
            `);

        // Validar si se eliminó algún registro
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado para eliminar"
            });
        }

        // Respuesta al cliente
        res.json({
            mensaje: "Alumno eliminado correctamente"
        });

    } catch (error) {

        console.error("Error al eliminar:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el alumno",
            error: error.message
        });
    }

});
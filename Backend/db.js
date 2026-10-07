const sql = require("mssql");

const config = {
    user: "sa",
    password: "1360324",
    server: "localhost",
    database: "Universidad",
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Conectado correctamente a SQL Server");
        return pool;
    })
    .catch(error => {
        console.error("Error conectando a SQL Server:");
        console.error(error);
        throw error;
    });

module.exports = {
    sql,
    poolPromise
};
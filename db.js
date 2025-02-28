require("dotenv").config();
const mysql = require ("mysql2/promise");


//connexion serveur

const pool = mysql.createPool({
    host: "127.0.0.1", 
    user: "root",
    password: "", 
    database: "EventS"
});

module.exports = pool;
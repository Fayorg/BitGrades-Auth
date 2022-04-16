const mariadb = require('mariadb');
const dotenv = require('dotenv').config();

// Initialize Pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

exports.query = async function(sql, params) {
    try{
        conn = await pool.getConnection();
        res = await conn.query(sql, params);
        await conn.end()
        return res;
    } catch(err) {
        console.log(err)
        throw err;
    }
}
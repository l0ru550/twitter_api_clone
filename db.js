const { Pool } = require('pg');
const config = require ('./config');

const pool = new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port
});

module.exports = {
    query: async (query, params) => {
        console.log(query, params);
        return await pool.query(query, params);
    }
};

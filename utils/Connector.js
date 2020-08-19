require("dotenv").config();

const sql = require("mssql");
const knex = require("knex");

const config = {
        client: process.env.DB_DRIVER,
        connection: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST, // You can use 'localhost\\instance' to connect to named instance
            database: process.env.DB_DATABASE
        }
}

const getConnection = async () => {
    try{
        await sql.connect(config);
        return sql;
    }catch(e){
        console.log(e);
    }
};

const getKnex = () => knex(config);

module.exports = {getConnection, getKnex};
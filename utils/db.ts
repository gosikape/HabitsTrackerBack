import {createPool} from "mysql2/promise";

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    database: 'megak_habit_tracker',
    namedPlaceholders: true,
    decimalNumbers: true,
});


/*  host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    port: Number(process.env.DB_PORT ?? 3001),
    namedPlaceholders: true,
    decimalNumbers: true,

 */

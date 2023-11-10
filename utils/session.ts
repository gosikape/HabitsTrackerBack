import session from 'express-session';
import {pool} from "./db";

const MySQLStore = require('express-mysql-session')(session);

interface MySQLStoreOptions {
    database: string;
    port: number;
    host: string;
    user: string;
}

const options: MySQLStoreOptions = {
    host: 'localhost',
    user: 'root',
    port: 3001,
    database: 'megak_habit_tracker',
};

export const sessionStore = new MySQLStore(options, pool);

/*
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT ?? 3001),
    database: process.env.MYSQL_DB,
 */

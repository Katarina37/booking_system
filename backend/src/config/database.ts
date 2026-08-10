//fajl za povezivanje sa bazom

import sql from 'mssql';
import dotenv from 'dotenv';

//ucitava vrijednosti iz .env fajla
dotenv.config();

//objekat
const config: sql.config = {
    server: process.env.DB_SERVER as string,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    options: {
        //da li se komunikacija enkriptuje izmedju baze i backenda
        encrypt: false,
        trustServerCertificate: true,
    },
};

//pravimo pool da ne bismo imali novu konekciju za svaki zahtjev, tj ovdje ga inicijalizujemo
//pocetna vrijednost je null jer kad se tek pokrene aplikacija, konekcija nije uspostavljena
let pool: sql.ConnectionPool | null = null;

//pravi pool prvi put kad se pozove
export async function getPool(): Promise<sql.ConnectionPool>{

    if(pool) return pool;
    //pravimo pool i konektujemo ga ka bazi
    pool = await new sql.ConnectionPool(config).connect();
    console.log('Povezano na SQL Server');

    return pool;
}

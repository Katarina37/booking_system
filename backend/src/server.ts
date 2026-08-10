import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import { getPool } from './config/database';

const PORT = process.env.PORT || 5000;

async function startServer(){
    try{
        await getPool();
        app.listen(PORT, () => {
            console.log(`Server radi na http://localhost:${PORT}`);
        });
    }
    catch(error){
        console.error('Neuspjesno pokretanje servera:', error);
        process.exit(1);
    }
}

startServer();
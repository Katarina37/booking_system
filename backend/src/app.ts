import express, {Application} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './modules/auth/auth-routes';
import serviceRouter from './modules/services/services-routes';

const app: Application = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

//parsira json tekst u js objekat i stavlja ga u req.body
app.use(express.json());
//cita cookies iz zahtjeva i stavlja u req.cookies
app.use(cookieParser());

//sve rute iz routera treba da imaju prefiks /api/auth
app.use('/api/auth', router);
app.use('/api/services', serviceRouter);

export default app;
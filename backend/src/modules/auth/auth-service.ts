import sql from 'mssql';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { getPool } from '../../config/database';
import { AuthResponse, RegisterInput, LoginInput } from '../../types/user-types';

const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

//REGISTRACIJA:
//1. provjera da li mejl vec postoji
//2. hesovanje lozinke
//3. cuvanje korisnika u bazi
//4. vracanje korisnika

export async function register(input: RegisterInput): Promise<AuthResponse>{

    const pool = await getPool();
    const existing = await pool.request().input('email', sql.NVarChar, input.email).query('SELECT Id FROM Users WHERE Email = @email');

    if(existing.recordset.length > 0){
        throw new Error('Korisnik sa datim mejlom vec postoji');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await pool.request().input('email', sql.NVarChar, input.email).input('passwordHash', sql.NVarChar, passwordHash).input('name', sql.NVarChar, input.name).query(`INSERT INTO Users (Email, PasswordHash, Name)
    OUTPUT INSERTED.Id, INSERTED.Email, INSERTED.Name INSERTED.Role VALUES (@email, @passwordHash, @name)`);

    const newUser = user.recordset[0];

    return{        
        id: newUser.Id,
        email: newUser.Email,
        name: newUser.Name,
        role: newUser.Role,
    };
}

//LOGOVANJE
//1. provjera korisnika po mejlu
//2. ako ne postoji greska
//3. poredjenje lozinki
//4. pravljenje jwt tokena
//5. vracanje korisnika i tokena

export async function login(input: LoginInput): Promise<{user: AuthResponse; token: string}>{

    const pool = await getPool();

    const result = await pool.request().input('email', sql.NVarChar, input.email).query('SELECT Id, Name, PasswordHash, Email, Role FROM Users WHERE Email = @email');

    const user = result.recordset[0];
    if(!user){
        throw new Error('Pogresan email ili lozinka');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.PasswordHash);
    if(!passwordMatches){
        throw new Error('Pogresan email ili lozinka');
    }

    const token = jwt.sign(
        {userId: user.Id, role: user.Role},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
    );

    return{
        user:{
            id: user.Id,
            email: user.Email,
            name: user.Name,
            role: user.Role,
        },
        token
    };

}
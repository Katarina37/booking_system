import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request{
    userId?: number;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) : void{

    const token = req.cookies?.token;
    if(!token){
        res.status(401).json({message: 'Niste ulogovani'});
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as {userId: number};
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(401).json({message:'Token nije validan'});
    }
}
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request{
    userId?: number;
    userRole?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) : void{

    const token = req.cookies?.token;
    if(!token){
        res.status(401).json({message: 'Niste ulogovani'});
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as {userId: number; role: string};
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    }catch(error){
        res.status(401).json({message:'Token nije validan'});
    }
}
//da ne bi klijent mogao da radi radnje admina
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void{
    if(req.userRole !== 'admin'){
        res.status(403).json({message: 'Nemate dozvolu za ovu akciju'});
        return;
    }
    next();
}


import { Request, Response } from "express";
import { LoginInput, RegisterInput } from "../../types/user-types";
import { login, register } from "./auth-service";

export async function registerController(req: Request, res: Response): Promise<void>{

   try{
        const input: RegisterInput = req.body;
        if(!input.email || !input.name || !input.password){
            res.status(400).json({message: 'Email i lozinka su obavezni'});
            return;
        }

        const newUser = await register(input);
        res.status(201).json(newUser);
   }catch(error){
        if(error instanceof Error && error.message === 'Korisnik sa datim mejlom vec postoji'){
            res.status(409).json({message: error.message});
            return;
        }
        console.error(error);
        res.status(500).json({message: 'Greska na serveru'});
   }
}

export async function loginController(req: Request, res: Response): Promise<void>{
    
    try{
        const input: LoginInput = req.body;
        if(!input.email || !input.password){
            res.status(400).json({message: 'Email i lozinka su obavezni'});
            return;
        }

        const {user, token} = await login(input);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7*24*60*60*1000
        });

        res.status(200).json(user);
    }catch(error){
        if(error instanceof Error && error.message === 'Korisnik sa datim mejlom vec postoji'){
            res.status(401).json({message: error.message});
            return;
        }
        console.error(error);
        res.status(500).json({message: 'Greska na serveru'});
    }
}
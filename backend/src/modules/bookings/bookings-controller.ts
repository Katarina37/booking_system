import { Request, Response } from "express";
import { getAvailableSlots, createBooking, getBookingsForClient, getAllBookings, deleteBooking } from "./booking-service";
import { AuthRequest } from "../auth/auth-middleware";
import { CreateBookingInput,AvailableSlostsQuery } from "../../types/booking-types";

export async function getAvailableSlotsController(req: AuthRequest, res: Response): Promise<void> {
    try{
        //get zahtijevi nemaju body, vec podaci stizu kroz URL (query string)
        //query je inace tipa string i moramo preko number prevesti ono sto ne treba da bude string
        const input: AvailableSlostsQuery = {
            employeeId: Number(req.query.employeeId),
            serviceId: Number(req.query.serviceId),
            date: req.query.date as string,
        };
        if(!input.employeeId || !input.serviceId || !input.date){
            res.status(400).json({message: "Niste unijeli sve potrebne podatke"});
            return;
        } 
        const slots = await getAvailableSlots(input);
        res.status(200).json(slots);
    }catch{
        res.status(500).json({message: "Greska na serveru"});
    }
}

export async function createBookingController(req: AuthRequest, res: Response): Promise<void> {
    try{
        const input: CreateBookingInput = req.body;
        //ovo ide samo kad je id dio putanje
        //izvlacenje id iz URL
        //const id = Number(req.params.id);
        const id = req.userId as number;
        if(!input.employeeId || !input.serviceId || !input.startTime){
            res.status(400).json({message: "Niste unijeli sve potrebne podatke"});
            return;
        }
        const booking = await createBooking(id, input);
        res.status(201).json(booking);
    }catch(err){
         if(err instanceof Error && err.message === 'Termin je zauzet'){
            res.status(400).json({message : err.message});
            return;
        }
        if(err instanceof Error && err.message === 'Usluga ne postoji'){
            res.status(400).json({message : err.message});
            return;
        }
        res.status(500).json({message: 'Greska na serveru'});
    }
}

export async function getBookingsForClientController(req: AuthRequest, res: Response): Promise<void> {
    try{
        const id = req.userId as number;
        const bookings = await getBookingsForClient(id);
        res.status(200).json(bookings);
    }catch{
        res.status(500).json({message: "Greska na serveru"});
    }
}

export async function getAllBookingsController(req: AuthRequest, res: Response): Promise<void>{
    try{
        const bookings = await getAllBookings();
        res.status(200).json(bookings);
    }catch{
        res.status(500).json({message: "Greska na serveru"});
    }    
}

export async function deleteBookingController(req: AuthRequest, res: Response): Promise<void> {
    try{
        const clientId = req.userId as number;
        const id = Number(req.params.id);
        const booking = await deleteBooking(id, clientId);
        res.status(200).json(booking);
    }catch(err){
        if(err instanceof Error && err.message === 'Rezervacija ne postoji'){
            res.status(400).json({message: err.message});
            return;
        }
        res.status(500).json({message: 'Greska na serveru'});
    }
}
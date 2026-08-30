import { Request, Response } from "express";
import { getServices, createService, updateService, deleteService } from "./services-service";
import { CreateServiceInput, UpdateServiceInput } from "../../types/service-types";

export async function getServicesController(req: Request, res: Response): Promise<void>{
    try{
        //const input = req.body;
        const services = await getServices();
        res.status(200).json(services);
    }catch{
        res.status(500).json('Greska na serveru');
    }
}

export async function createServiceController(req: Request, res: Response): Promise<void> {
    
    try{
        const input: CreateServiceInput = req.body;
        if(!input.name || !input.durationMinutes || !input.price){
            res.status(400).json({message: "Niste unijeli sve u obavezna polja"});
            return;
        }
        const service = await createService(input);
        res.status(201).json(service);
    }catch{
        res.status(500).json({message: "Greska na serveru"});
    }
}

export async function updateServiceController(req: Request, res: Response): Promise<void> {
    try{
        //fali id
        //izvlacenje id iz URL
        const id = Number(req.params.id);
        const input: UpdateServiceInput = req.body;
        const service = await updateService(id, input);
        res.status(201).json(service);
    }catch(error){
        if(error instanceof Error && error.message === 'Usluga ne postoji'){
            return;
        }
        res.status(500).json({message: "Greska ne serveru"});
    }
}

export async function deleteServiceController(req: Request, res: Response): Promise<void>{
    try{
        const id = Number(req.params.id);
        const input = req.body;
        //fali id
        const service = await deleteService(id);
        res.status(204).send();
    }catch(error){
        if(error instanceof Error && error.message === 'Usluga ne postoji'){
            res.status(404).json({message: error.message});
            return;
        }
        res.status(500).json({message: 'Greska na serveru'});
    }
}

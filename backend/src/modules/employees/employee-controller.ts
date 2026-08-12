import { Request, Response } from "express";
import { EmployeeResponse, CreateEmployeeInput } from "../../types/employee-types";
import { getEmployees, createEmployee, deleteEmployee } from "./employee-service";

export async function getEmployeesController(req: Request, res: Response): Promise<void>{
    try{
        const employees = await getEmployees();
        res.status(200).json(employees);
    }catch{
        res.status(500).json({message: 'Greska na serveru'});
    }
}


export async function createEmployeeController(req: Request, res: Response): Promise<void> {
    try{
        const employee : CreateEmployeeInput = req.body;
        if(!employee.email || !employee.name || !employee.serviceIds){
            res.status(400).json({message: 'Niste unijeli sva obavezna polja'});
            return;
        }
        const empl = await createEmployee(employee);
        res.status(201).json(empl);
    }catch{
        res.status(500).json({message: 'Greska na serveru'});
    }
}

export async function deleteEmployeeController(req: Request, res: Response): Promise<void> {
    try{
        const id = Number(req.params.id);
        const result = await deleteEmployee(id);
        res.status(204).json(result);
    }catch(error){
        if(error instanceof Error && error.message === 'Zaposleni ne postoji'){
            res.status(404).json({message: error.message});
            return;
        }
        res.status(500).json({message: 'Greska na serveru'});
    }
}

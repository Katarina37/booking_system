export interface Employees{
    Id: number;
    Name: string;
    Email: string;
    CreatedAt: Date;
}

export interface CreateEmployeeInput{
    name: string;
    email: string;
    //koje usluge zaposleni radi
    serviceIds: number[];
}

export interface UpdateEmployeeInput{
    name?: string;
    email?: string;
}

export interface EmployeeResponse{
    id: number;
    name: string;
    email: string | null;
    services: {id: number; name: string}[];
}

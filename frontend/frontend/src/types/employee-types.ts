export interface CreateEmployeeInput{
    name: string;
    email?: string;
    serviceIds: number[];
}

export interface Employee{
    id: number;
    name: string;
    email: string | null;
    services: {id: number; name: string}[];
}

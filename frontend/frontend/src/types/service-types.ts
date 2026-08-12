//svi tipovi kao na backendu, bez onog sto je isti kao tabela u bazi
export interface CreateServiceInput{
    name: string;
    durationMinutes: number;
    price: number;
}

export interface UpdateServiceInput{
    name?: string;
    durationMinutes?: number;
    price?: number;
}

export interface ServiceResponse{
    id: number;
    name: string;
    durationMinutes: number;
    price: number;
}
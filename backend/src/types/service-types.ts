//odgovara tabeli u bazi podataka
export interface Service{
    Id: number;
    Name: string;
    DurationMinutes: number;
    Price: number;
    CreatedAt: Date
}

//ono sta frontend salje
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

//ono s cim backend odgovara
export interface ServiceResponse{
    id: number;
    name: string;
    durationMinutes: number;
    price: number;
}
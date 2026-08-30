export interface Booking{
    Id: number;
    ClientId: number;
    EmployeeId: number;
    ServiceId: number;
    StartTime: Date;
    EndTime: Date;
}

//fe -> be kad klijent zakazuje
//sta klijent unosi
export interface CreateBookingInput{
    employeeId: number;
    serviceId: number;
    //iso string
    startTime: string;
}

// fe -> be kad fe trazi listu slobodnih termina
//sta klijent unosi
export interface AvailableSlostsQuery{
    employeeId: number;
    serviceId: number;
    date: string;
}

// be -> fe 
export interface BookingResponse{
    id: number;
    employeeId: number;
    serviceId: number;
    startTime: string;
    endTime: string;
}
export interface CreateBookingInput{
    employeeId: number;
    serviceId: number;
    startTime: string;
}

export interface AvailableSlostsQuery{
    employeeId: number;
    serviceId: number;
    date: string;
}

export interface BookingResponse{
    id: number;
    employeeId: number;
    serviceId: number;
    startTime: string;
    endTime: string;
}

export interface ClientBookingResponse{
    id: number;
    employeeName: string;
    serviceName: string;
    startTime: string;
    endTime: string;
}
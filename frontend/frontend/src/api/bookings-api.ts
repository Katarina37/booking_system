import type { AvailableSlostsQuery, CreateBookingInput, BookingResponse, ClientBookingResponse } from "../types/booking-types";
import axiosInstance from "./axiosInstance";

export async function getAvailableSlots(query: AvailableSlostsQuery): Promise<BookingResponse[]> {
    const response = await axiosInstance.get<BookingResponse[]>('/bookings/available-slots', {params: query});
    return response.data;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingResponse> {
    const response = await axiosInstance.post<BookingResponse>('/bookings', input);
    return response.data;
}

export async function getBookingsForClient(id: number): Promise<ClientBookingResponse[]> {
    const response = await axiosInstance.get<ClientBookingResponse[]>(`/bookings/${id}`);
    return response.data;
}

export async function getAllBookings(): Promise<ClientBookingResponse[]> {
    const response = await axiosInstance.get<ClientBookingResponse[]>('/bookings');
    return response.data;
}

export async function deleteBooking(id: number): Promise<void>{
    await axiosInstance.delete(`/bookings/${id}`);
}



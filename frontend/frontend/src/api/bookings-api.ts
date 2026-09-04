import type { AvailableSlostsQuery, CreateBookingInput, BookingResponse, ClientBookingResponse, AdminBookingResponse } from "../types/booking-types";
import axiosInstance from "./axiosInstance";

export async function getAvailableSlots(query: AvailableSlostsQuery): Promise<string[]> {
    const response = await axiosInstance.get<string[]>('/bookings/available-slots', {params: query});
    return response.data;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingResponse> {
    const response = await axiosInstance.post<BookingResponse>('/bookings', input);
    return response.data;
}

export async function getBookingsForClient(): Promise<ClientBookingResponse[]> {
    const response = await axiosInstance.get<ClientBookingResponse[]>('/bookings/my-bookings');
    return response.data;
}

export async function getAllBookings(): Promise<AdminBookingResponse[]> {
    const response = await axiosInstance.get<AdminBookingResponse[]>('/bookings');
    return response.data;
}

export async function deleteBooking(id: number): Promise<void>{
    await axiosInstance.delete(`/bookings/${id}`);
}



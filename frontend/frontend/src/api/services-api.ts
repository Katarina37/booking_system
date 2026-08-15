import type{ CreateServiceInput, UpdateServiceInput, ServiceResponse } from "../types/service-types";
import axiosInstance from "./axiosInstance";

export async function getServices(): Promise<ServiceResponse[]> {
    const response = await axiosInstance.get<ServiceResponse[]>('/services');
    return response.data;
}

export async function createService(input: CreateServiceInput): Promise<ServiceResponse> {
    const response = await axiosInstance.post<ServiceResponse>('/services', input);
    return response.data;
}

export async function updateService(input: UpdateServiceInput): Promise<ServiceResponse> {
    const response = await axiosInstance.put<ServiceResponse>('/services/${id}', input);
    return response.data;
}

export async function deleteService(id: number): Promise<void> {
    await axiosInstance.delete(`/services/${id}`);
}
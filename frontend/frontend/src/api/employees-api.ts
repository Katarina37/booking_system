import axiosInstance from "./axiosInstance";
import type { Employee, CreateEmployeeInput } from "../types/employee-types";

export async function getEmployees(): Promise<Employee[]> {
    const response = await axiosInstance.get<Employee[]>('/employees');
    return response.data;
}

export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const response = await axiosInstance.post<Employee>('/employees', input);
    return response.data;
}

export async function deleteEmployee(id: number): Promise<void> {
    await axiosInstance.delete(`/employees/${id}`);
}
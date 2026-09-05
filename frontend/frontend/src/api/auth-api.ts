import axiosInstance from "./axiosInstance";
import type { RegisterInput, LoginInput, AuthUser } from "../types/auth-types";

export async function registerUser(input: RegisterInput): Promise<AuthUser>{
    //salje zahtjev na /auth/register, a input(registerinput) je tijelo zahtjeva
    //<authuser> govori kakav se ocekuje da bude odgovor
    const response = await axiosInstance.post<AuthUser>('/auth/register', input);
    //ide data, jer je to authuser objekat
    return response.data;
}

export async function loginUser(input: LoginInput): Promise<AuthUser>{
    const response = await axiosInstance.post<AuthUser>('/auth/login', input);
    return response.data;
}

export async function logoutUser(): Promise<void> {
    await axiosInstance.post('/auth/logout');
}
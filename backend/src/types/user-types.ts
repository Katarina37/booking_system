export interface User{
    Id: number;
    Email: string;
    PasswordHash: string;
    Name: string;
    CreatedAt: Date;
}

export interface RegisterInput{
    email: string;
    password: string;
    name: string;
}

export interface LoginInput{
    email: string;
    password: string;
}

export interface AuthResponse{
    id: number;
    email: string;
    name: string;
    role: string;
}
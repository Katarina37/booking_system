export interface RegisterInput{
    email: string;
    password: string;
    name: string;
}

export interface LoginInput{
    email: string;
    password: string;
}

export interface AuthUser{
    id: number;
    email: string;
    name: string;
    role: string;
}
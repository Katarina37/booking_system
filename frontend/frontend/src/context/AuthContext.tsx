import { useContext, createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { loginUser, registerUser } from "../api/auth-api";
import type { LoginInput, RegisterInput, AuthUser } from "../types/auth-types";

//govori nam sta ce biti dostupno komponentama koje budu koristile kontekst
interface AuthContextType{
    user: AuthUser | null;
    isLoading: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    //ova f-ja nije async, pa ne treba promise
    logout: () => void;
}

//kontejner (kao tabla) za kontekst, gdje ce biti svi podaci iz ovog gore interfejsa
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}){
    //ovdje se cuva stanje korisnika i isLoading-a, a pocetne vrijednosti su im null i true
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false)
    }, []);

    //poziva f-je iz api fajla, koja salje zahtjev ka be, i prima odgovor i onda koristi taj odgovor da postavi korisnika sa tim odgovorom kao stanje koje ce se prikazati na 'tabli'
    async function login(input:LoginInput) {
        const loggedUser = await loginUser(input);
        setUser(loggedUser);
    }

    async function register(input:RegisterInput) {
        const newUser = await registerUser(input);
        setUser(newUser);
    }

    function logout(){
        setUser(null);
    }

    return(
        <AuthContext.Provider value={{user, isLoading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth():AuthContextType{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth moze se koristiti samo unutar AuthProvider-a');
    }
    return context;
}


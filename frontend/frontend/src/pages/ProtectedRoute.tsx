import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

//ovo se koristi da kada bi neko rucno pokusao da udje na /dashboard rutu(ili bilo koju a uopste nije ulogovan) onda ga preusmjerava na login stranicu umjesto da uopste pokusa da rucno pristupi toj ruti koja mu nije dozvoljena

//{children} : {children: ReactNode}) -> ovo se koristi kad koristimo nesto da obavijemo oko necega drugog, npr to je koristeno i kod authprovidera

//dodato za requireAdmin
function ProtectedRoute({children, requireAdmin = false} : {children: ReactNode; requireAdmin?: boolean}){

    const {user, isLoading} = useAuth();

    //prvo se provjeri da li se vrsi ucitavanje da ne bismo bespotrebno izbacili 'korisnika' na login
    if(isLoading){
        return <p>Ucitavanje...</p>;
    }

    //replace stoji da ne bismo strelicom unazad mogli opet da se vratimo na zasticenu rutu
    if(!user){
        return <Navigate to="/login" replace/>;
    }

    //dodato
    if(requireAdmin && user.role !== 'admin'){
        return <Navigate to="/dashboard" replace/>
    }

    return <>{children}</>
}

export default ProtectedRoute;
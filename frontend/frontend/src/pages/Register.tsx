import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register(){
    //zasto bas ovi parametri
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    //pratimo da li se poslao zahtjev, da ne bismo 2 puta poslali registraciju
    const [isSubmitting, setIsSubmitting] = useState(false);

    //uzimamo register f-ju iz useAuth contexta
    const {register} = useAuth();
    const navigate = useNavigate();

    //f-ja koja se poziva kad korisnik posalje formu
    async function handleSubmit(e: FormEvent) {
        //sprecava refresh stranice kad se forma posalje
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try{    
            await register({email, password, name});
            navigate('/dashboard');
        }catch(err){
            setError('Registracija nije uspjela. Pokusajte ponovo.');
        }finally{
            setIsSubmitting(false);
        }
    }

    return(
        <div>
            <h1>Registracija</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Ime</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Lozinka</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Registracija je u toku...' : 'Registruj se'}
                </button>
            </form>

            <p>
                Vec imas nalog? <Link to="/login">Uloguj se</Link>
            </p>

        </div>
    );


}

export default Register;
import { Link, useActionData, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, type FormEvent } from "react";


function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent){
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try{
            await login({email, password});
            navigate('/dashboard');
        }catch(err){
            setError('Logovanje nije uspjelo. Pokusajte ponovo.');
        }finally{
            setIsSubmitting(false);
        }
    }

    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id={email}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id={password}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logovanje je u toku...' : "Login"}
                </button>
            </form>

            <p>Nemate nalog? <Link to="/register">Registrujte se</Link></p>

        </div>
    );
}

export default Login;
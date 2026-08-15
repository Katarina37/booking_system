import { Link, useActionData, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, type FormEvent } from "react";
import './css/Auth.css'


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
        <div className="auth-page">
            <div className="auth-card">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="auth-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id={email}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id={password}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" className="auth-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Loggin in...' : "Login"}
                </button>
            </form>

            <p className="auth-switch">Don't have an account? <Link to="/register">Register here</Link></p>

            </div>
            
        </div>
    );
}

export default Login;
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard(){
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return(
        <div>
            <h1>Dobrodosao {user?.name}</h1>
            <button onClick={handleLogout}>Odjavi se</button>
        </div>
    );
}

export default Dashboard;
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import './css/Dashboard.css'

function Dashboard(){
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return(
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="dashboard-header-text">
                    <h1>Dobrodošao {user?.name}</h1>
                </div>
                <button className="dashboard-logout" onClick={handleLogout}>Odjavi se</button>
            </div>

            <div className="dashboard-content">
                {user?.role === 'admin' && (
                <>
                    <h2>Admin panel</h2>
                    <div className="admin-panel-grid">
                        <Link to="/admin/services" className="admin-panel-card">
                            <h3>Usluge</h3>
                            <p>Dodajte ili kreirajte usluge</p>
                        </Link>
                        <Link to="/admin/employees" className="admin-panel-card">
                             <h3>Zaposleni</h3>
                            <p>Upravljajte zaposlenim i njihovim uslugama</p>
                        </Link>
                    </div>
                    <br></br>
                </>
            )}
            <div className="admin-panel-grid">
                        <Link to="/bookings" className="admin-panel-card">
                            <h3>Rezervacije</h3>
                            <p>Kreirajte rezervaciju</p>
                        </Link>
                        <Link to="/my-bookings" className="admin-panel-card">
                            <h3>Moje rezervacije</h3>
                            <p>Pregled Vaših rezervacija</p>
                        </Link>
            </div>
        </div>
        </div>
    );
}

export default Dashboard;
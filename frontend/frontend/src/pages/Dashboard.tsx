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
                    <h1>Welcome {user?.name}</h1>
                </div>
                <button className="dashboard-logout" onClick={handleLogout}>Log out</button>
            </div>

            <div className="dashboard-content">
                {user?.role === 'admin' && (
                <>
                    <h2>Admin panel</h2>
                    <div className="admin-panel-grid">
                        <Link to="/admin/services" className="admin-panel-card">
                            <h3>Services</h3>
                            <p>Add or delete services</p>
                        </Link>
                        <Link to="/admin/employees" className="admin-panel-card">
                             <h3>Employees</h3>
                            <p>Manage employees and their services</p>
                        </Link>
                    </div>
                    <br></br>
                </>
            )}
            <div className="admin-panel-grid">
                        <Link to="/bookings" className="admin-panel-card">
                            <h3>Bookings</h3>
                            <p>Create a booking</p>
                        </Link>
            </div>
            <br></br>
            <div className="admin-panel-grid">
                        <Link to="/my-bookings" className="admin-panel-card">
                            <h3>My Bookings</h3>
                            <p>View your bookings</p>
                        </Link>
            </div>
        </div>
            

            
            
        </div>
    );
}

export default Dashboard;
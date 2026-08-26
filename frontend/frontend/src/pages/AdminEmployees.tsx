import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { getEmployees, createEmployee, deleteEmployee } from "../api/employees-api";
import type { Employee } from "../types/employee-types";
import type { ServiceResponse } from "../types/service-types";
import { getServices } from "../api/services-api";
import { Link } from "react-router-dom";
import './css/Admin.css';

function AdminEmployees(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedServiceIds, setSelectedServicesIds] = useState<number[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData(){
        try{
            //kao kad bismo napisali await getServices i getEmployees
            const [employeesData, servicesData] = await Promise.all([
                getEmployees(),
                getServices(),
            ]);
            setEmployees(employeesData);
            setServices(servicesData);
        }catch(err){
            setError('Greska pri ucitavanju podataka');
        }finally{
            setIsLoading(false);
        }
    }

    function toggleServiceId(id: number){
        setSelectedServicesIds((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        if(selectedServiceIds.length === 0){
            setError('Izaberite barem jednu uslugu');
            return;
        }
        try{
            await createEmployee({
                name,
                email: email || undefined,
                serviceIds: selectedServiceIds
            });
            setName('');
            setEmail('');
            setSelectedServicesIds([]);
            await loadData();
        }catch(err){
            setError('Dodavanje zaposlenog nije uspjelo');
        }
    }

    async function handleDelete(id: number) {
        try{
            await deleteEmployee(id);
            await loadData();
        }catch(err){
            setError('Brisanje zaposlenog nije uspjelo');
        }
    }
    return(
        <div className="admin-page">
            <div className="admin-container">
                <Link to="/dashboard" className="admin-back-link">Back to dashboard</Link>
                <h1>Managing employees</h1>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label htmlFor="name">Name</label>
                            <input
                            id="name"
                            value={name}
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            required
                            />
                        </div>
                        <div className="admin-field">
                            <label htmlFor="email">Email</label>
                            <input
                            id="email"
                            value={email}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    
                <div className="admin-checkbox-group">
                    <p>Employee's services:</p>
                    {services.map((service) => (
                        <label key={service.id} className="admin-checkbox-label">
                            <input
                            type="checkbox"
                            checked={selectedServiceIds.includes(service.id)}
                            onChange={() => toggleServiceId(service.id)}/>
                            {service.name}
                        </label>
                    ))}
                </div>

                {error && <p className="admin-error">{error}</p>}
                <button type="submit" className="admin-submit">Add employee</button>
            </form>
            <h2>Existing employees</h2>
            {isLoading ? (
                <p>Loading...</p>
                ) : employees.length === 0 ? (
                <p className="admin-empty">Currently no added employees</p>
                ) : (
                <ul className="admin-list">
                    {employees.map((employee) => (
                        <li key={employee.id} className="admin-list-item">
                            <div className="admin-list-item-info">
                                <strong>{employee.name}</strong>
                                <span>
                                    {employee.email && `(${employee.email})`}{' - '}
                                    {employee.services.map((s) => s.name).join(', ')}
                                </span>
                            </div>
                            <button className="admin-delete-btn" onClick={() => handleDelete(employee.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            </div>  
        </div>
    );

}

export default AdminEmployees;
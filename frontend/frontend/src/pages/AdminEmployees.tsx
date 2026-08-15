import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { getEmployees, createEmployee, deleteEmployee } from "../api/employees-api";
import type { Employee } from "../types/employee-types";
import type { ServiceResponse } from "../types/service-types";
import { getServices } from "../api/services-api";

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
        <div>
            <h1>Upravljanje zaposlenima</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Ime</label>
                    <input
                    id="name"
                    value={name}
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                    id="email"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <p>Usluge koje radi:</p>
                    {services.map((service) => (
                        <label key={service.id} style={{display:'block'}}>
                            <input
                            type="checkbox"
                            checked={selectedServiceIds.includes(service.id)}
                            onChange={() => toggleServiceId(service.id)}/>
                            {service.name}
                        </label>
                    ))}
                </div>
                {error && <p style={{color:'red'}}>{error}</p>}
                <button type="submit">Dodaj zaposlenog</button>
            </form>
            <h2>Postojeci zaposleni</h2>
            {isLoading ? (
                <p>Ucitavanje...</p>
            ) : employees.length === 0 ? (
                <p>Trenutno nema zaposlenih</p>
            ) : (
                <ul>
                    {employees.map((employee) => (
                        <li key={employee.id}>
                            {employee.name}
                            {employee.email && `(${employee.email})`}{' - '}
                            {employee.services.map((s) => s.name).join(', ')}
                            <button onClick={() => handleDelete(employee.id)}>
                                Obrisi
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}

export default AdminEmployees;
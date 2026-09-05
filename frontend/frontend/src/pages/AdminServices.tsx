import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { getServices, createService, deleteService } from "../api/services-api";
import type { ServiceResponse } from "../types/service-types";
import './css/Admin.css';
import { Link } from "react-router-dom";


function AdminServices(){

    //servisi, greska, isLoading i parametri iz baze (ServiceReponse)
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [name, setName] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    //cim se stranica ucita, povuci usluge sa be
    useEffect(() => {
        loadServices();
    }, [])


    //parametri za ove dole f-je idu isti kao kod api fajla
    //f-ja iz apija pa onda setState, eventualno loadServices

    //get services
    async function loadServices() {
        try{
            const data = await getServices();
            setServices(data);
        }catch(err){
            setError('Greska pri ucitavanju usluga');
        }finally{
            setIsLoading(false);
        }
    }

    //create service
    //ima formu za slanje podataka i tad uvijek ide e.preventDefault i ciscenje starih gresaka
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        try{
            await createService({
                name,
                durationMinutes: Number(durationMinutes),
                price: Number(price)
            });
            setName('');
            setDurationMinutes('');
            setPrice('');

            await loadServices();
        }catch(err){
            setError('Greska pri dodavanju usluge');
        }
    }

    //delete service
    async function handleDelete(id: number, name: string) {
        const confirmed = window.confirm(`Da li ste sigurni da zelite da obrisete uslugu ${name}`);
        if(!confirmed) return;
        setDeletingId(id);
        setError(null);
        try{
            await deleteService(id);
            await loadServices();
        }catch(err){
            setError('Usluga koju zelite da obrisete ima rezervacije.');
        }finally{
            setDeletingId(null);
        }
    }

    return(
        <div className="admin-page">
            <div className="admin-container">
                <Link to="/dashboard" className="admin-back-link">Nazad na početnu</Link>
                <h1>Upravljanje uslugama</h1>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-row">
                        <div className="admin-field">
                            <label htmlFor="name">Ime</label>
                            <input
                            id="name"
                            value={name}
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            required/>
                        </div>
                        <div className="admin-field">
                            <label htmlFor="duration">Trajanje (min)</label>
                            <input
                            id="duration"
                            value={durationMinutes}
                            type="number"
                            onChange={(e) => setDurationMinutes(e.target.value)}
                            required
                            min={1}
                            />
                        </div>
                        <div className="admin-field">
                            <label htmlFor="price">Cijena (KM)</label>
                            <input
                            id="price"
                            value={price}
                            type="number"
                            onChange={(e) => setPrice(e.target.value)}
                            required                      
                            min={0}
                            step="0.01"/>
                        </div>
                    </div>
                    
                    {error && <p className="admin-error">{error}</p>}
                    <button type="submit" className="admin-submit">Dodaj uslugu</button>
                </form>
                <h2>Postojeće usluge</h2>
                {isLoading ? (
                    <p>Učitavanje...</p>
                ) : services.length === 0 ? (
                    <p className="admin-empty">Trenutno nema dodatih usluga</p>
                ) : (
                    <ul className="admin-list">
                        {services.map((service) => (
                            <li key={service.id} className="admin-list-item">
                                <div className="admin-list-item-info">
                                    <strong>{service.name}</strong>
                                    <span>{service.durationMinutes} min - {service.price} KM</span>
                                </div>
                                <button className="admin-delete-btn" onClick={() => handleDelete(service.id, service.name)}>Obriši</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>  
        </div>
    );
}

export default AdminServices;
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { getServices, createService, deleteService } from "../api/services-api";
import type { ServiceResponse } from "../types/service-types";


function AdminServices(){

    //servisi, greska, isLoading i parametri iz baze (ServiceReponse)
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [name, setName] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
    async function handleDelete(id: number) {
        try{
            await deleteService(id);
            await loadServices();
        }catch(err){
            setError('Greska pri brisanju usluge');
        }
    }

    return(
        <div>
            <h1>Upravljanje uslugama</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Naziv</label>
                    <input
                    id="name"
                    value={name}
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required/>
                </div>
                <div>
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
                <div>
                    <label htmlFor="price">Cijena</label>
                    <input
                    id="price"
                    value={price}
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    //??
                    min={0}
                    step="0.01"/>
                </div>
                {error && <p style={{color:'red'}}>{error}</p>}
                <button type="submit">Dodaj uslugu</button>
            </form>

            <h2>Postojece usluge</h2>
            {isLoading ? (
                <p>Ucitavanje...</p>
            ) : services.length === 0 ? (
                <p>Trenutno nema dodanih usluga</p>
            ) : (
                <ul>
                    {services.map((service) => (
                        <li key={service.id}>
                            {service.name} - {service.durationMinutes} min - {service.price}
                            <button onClick={() => handleDelete(service.id)}>Obrisi</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminServices;
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
}

export default AdminServices;
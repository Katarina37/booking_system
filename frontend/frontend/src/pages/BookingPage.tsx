import { useState, useEffect } from "react";
import type { ServiceResponse } from "../types/service-types";
import type { Employee } from "../types/employee-types";
import { getServices } from "../api/services-api";
import { getEmployees } from "../api/employees-api";
import { getAvailableSlots } from "../api/bookings-api";
import { createBooking } from "../api/bookings-api";
import './css/Admin.css';
import './css/Booking.css';
import { Link } from "react-router-dom";

function formatTimeOnly(isoString: string): string {
    const date = new Date(isoString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function BookingPage(){
    //liste
    const [services, setServices] = useState<ServiceResponse[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    //sta korisnik bira
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    //status/greske
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if(selectedService && selectedEmployee && selectedDate){
            loadAvailableSlots();
        }
    }, [selectedService, selectedEmployee, selectedDate]);

    //f-ja za ucitavanje usluga i zaposlenih
    async function loadData() {
       try{
        const [servicesData, employeesData] = await Promise.all([
            getServices(),
            getEmployees(),
        ]);
        setServices(servicesData);
        setEmployees(employeesData);
       }catch(err){
        setError('Greska pri ucitavanju podataka');
       }finally{    
        setIsLoading(false);
       }
    }

    //f-ja za ucitavanje slobodnih termina
    async function loadAvailableSlots() {
        if(!selectedService || !selectedEmployee || !selectedDate)
            return;

        try{
            const slots = await getAvailableSlots({
                employeeId: selectedEmployee,
                serviceId: selectedService,
                date: selectedDate
            });
            setAvailableSlots(slots); 
        }catch(err){
            setError("Greska pri ucitavanju slobodnih termina");
        }
    }

    async function handleBooking() {
        if(!selectedService || !selectedEmployee || !selectedSlot){
            return;
        }
        try{
            await createBooking({
                employeeId: selectedEmployee,
                serviceId: selectedService,
                startTime: selectedSlot
            });
            alert("Booking successfully created");
        }catch(err){
            setError("Greska pri kreiranju rezervacije");
        }
    }

    return(
        <div className="admin-page">
            <div className="admin-container">
                <Link to="/dashboard" className="admin-back-link">
                Nazad na početnu</Link>
                <h1>Kreirajte rezervaciju</h1>
                <div>
                    <h2>Odaberite uslugu</h2>
                    {isLoading ? (
                        <p className="admin-empty">Učitavanje...</p>
                    ) : (
                        <div className="booking-options-grid">
                            {
                                services.map((service) => (
                                    <button key={service.id} className={`booking-option-btn ${selectedService === service.id ? 'selected' : ''}`} onClick={() => setSelectedService(service.id)}>
                                        {service.name} - {service.durationMinutes} min
                                    </button>
                                ))
                            }
                        </div>
                    )}
                </div>
                {
                    selectedService && (
                        <div>
                            <h2>Odaberite zaposlenog</h2>
                            <div className="booking-options-grid">
                                {employees.filter((employee) => employee.services.some((s) => s.id === selectedService)).map((employee) => (
                                    <button key={employee.id} className={`booking-option-btn ${selectedEmployee === employee.id ? 'selected' : ''}`} onClick={() => setSelectedEmployee(employee.id)}>
                                        {employee.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
            }
            {
                selectedEmployee && (
                    <div>
                        <h2>Odaberite datum</h2>
                        <input
                        type="date"
                        className="booking-date-input"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedSlot(null);
                        }}/>
                    </div>
                )
            }
            {
                selectedDate && (
                    <div>
                        <h2>Dostupni termini</h2>
                        {
                            availableSlots.length === 0 ? (
                                <p className="admin-empty">Nema dostupnih termina</p>
                            ) : (
                                <div className="booking-slots-grid">
                                    {
                                        availableSlots.map((slot) => (
                                            <button key={slot} className={`booking-option-btn ${selectedSlot === slot ? 'selected' : ''}`} onClick={() => setSelectedSlot(slot)}>
                                                {formatTimeOnly(slot)}
                                            </button>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                )
            }
            {
                selectedSlot && (
                    <div className="booking-confirm-section">
                        <button onClick={handleBooking} className="admin-submit">
                            Prihvatite rezervaciju
                        </button>
                    </div>
                )
            }


            </div>
            
            
            
            

            
            

            {error && <p>{error}</p>}
        </div>
    );
}

export default BookingPage;
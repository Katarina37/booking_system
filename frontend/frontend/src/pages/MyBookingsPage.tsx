import { useState, useEffect } from "react";
import { getBookingsForClient } from "../api/bookings-api";
import type { ClientBookingResponse } from "../types/booking-types";
import { deleteBooking } from "../api/bookings-api";
import './css/Admin.css';
import './css/Booking.css';
import { Link } from "react-router-dom";

function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${day}.${month}.${year}. ${hours}:${minutes}`;
}

function MyBookingsPage(){
    
    const [bookings, setBookings] = useState<ClientBookingResponse[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        try{
            const data = await getBookingsForClient();
            setBookings(data);
        }catch(err){
            setError('Greska pri ucitavanju rezervacija');
        }finally{
            setIsLoading(false);
        }
    }

    async function handleCancel(id: number) {
        const confirmed = window.confirm('Are you sure you want to cancel the booking?');
        if(!confirmed) return;
        setDeletingId(id);
        try{
            await deleteBooking(id);
            //obrisano je u bazi, sad treba i react state da azuriramo 
            setBookings((prev) => prev.filter((b) => b.id !== id));
        }catch(err){
            setError('Greska pri otkazivanju rezervacije');
        }finally{
            setDeletingId(null);
        }
    }
    
    if(isLoading){
        return (
            <div className="admin-page">
                <div className="admin-container">
                    <p className="admin-empty">Loading...</p>
                </div>
            </div>
        );
    }

    //odvajanje proslih i buducih termina
    const now = new Date();
    const upcoming = bookings.filter((b) => new Date(b.startTime) >= now );
    const past = bookings.filter((b) => new Date(b.startTime) < now);
    
    return(
        <div className="admin-page">
            <div className="admin-container">
                <Link to="/dashboard" className="admin-back-link">Back to dashboard</Link>
                <h1>My bookings</h1>
                {
                    bookings.length === 0 ? (
                        <p className="admin-empty">No added bookings</p>
                    ) : (
                        <>
                            <h2>Upcoming bookings</h2>
                            {
                                upcoming.length === 0 ? (
                                    <p className="admin-empty">No upcoming bookings</p>
                                ) : (
                                    <ul className="admin-list">
                                        {
                                            upcoming.map((booking) => (
                                            <li key={booking.id} className="admin-list-item">
                                                <div className="admin-list-item-info">
                                                    <strong>
                                                        {formatDateTime(booking.startTime)}
                                                    </strong>
                                                    <span>
                                                        {booking.serviceName} at {booking.employeeName}
                                                    </span>
                                                </div>
                                                <button 
                                                className="admin-delete-btn"
                                                onClick={() => handleCancel(booking.id)} disabled={deletingId === booking.id}>
                                                    Cancel
                                                </button>
                                            </li>
                                            ))
                                        }
                                    </ul>
                                )
                            }
                            {
                                past.length > 0 && (
                                    <>
                                        <h2>Previous bookings</h2>
                                        <ul className="admin-list">
                                            {
                                                past.map((booking) => (
                                                    <li key={booking.id} className="admin-list-item">
                                                        <div className="admin-list-item-info">
                                                            <strong>
                                                                {formatDateTime(booking.startTime)}
                                                            </strong>
                                                            <span>
                                                                {booking.serviceName} at {booking.employeeName}
                                                            </span>
                                                        </div>
                                                        <span className="booking-status-badge">
                                                            Past
                                                        </span>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div>    
        </div>
    );
}

export default MyBookingsPage;
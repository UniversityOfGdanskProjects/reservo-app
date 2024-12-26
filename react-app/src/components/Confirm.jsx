import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Confirm() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    useEffect(() => {
        const storedReservations = localStorage.getItem('reservations');
        const reservations = JSON.parse(storedReservations);
        const reservation = reservations[reservations.length - 1];
        setDate(reservation.date);
        setTime(reservation.time);
      }, []); 
    return (
        <div className='confirm-reservation'>
            <h2>Potwierdź rezerwację</h2>
            <div>
                Miejsce:
            </div>
            <div>
                Data: {date}
            </div>
            <div>

                Godzina: {time}
            </div>
        </div>
    );
    
}
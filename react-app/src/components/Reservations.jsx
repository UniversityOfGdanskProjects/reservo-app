import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            console.log(reservations);//debug
            setReservations(reservations);
        }
    }, []); 

    return (
        <div className='reservations-page'>
             <h3>Twoje rezerwacje:</h3>
            {reservations.map((reservation, index) => (
                <div key={index}>
                    Data: {reservation.date}, Godzina: {reservation.time}
                </div>
            ))}
        </div>
    );
}
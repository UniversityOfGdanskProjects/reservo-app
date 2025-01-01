import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const currentUserId = localStorage.getItem('currentUserId');

    useEffect(() => {
        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            console.log("res" + reservations);
            const filtered = reservations.filter((reservation) => reservation.userId == currentUserId);
            filtered.map((el) => console.log(el));//debug
            setReservations(filtered);
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
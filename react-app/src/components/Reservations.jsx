import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [reservationsEmpty, setReservationsEmpty] = useState(true);
    const currentUserId = localStorage.getItem('currentUserId');

    useEffect(() => {
        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            console.log("res" + reservations);//debug
            const filtered = reservations.filter((reservation) => reservation.userId == currentUserId);
            filtered.map((el) => console.log(el.restaurant));//debug
            setReservations(filtered);
            if (filtered.length >= 1) {
                setReservationsEmpty(false);
            }
        }
    }, []); 

    const handleClick = () => {
        navigate(`/search`);
    }

    return (
        <div className='reservations-page'>
            {reservationsEmpty === true && (
                <div className='no-reservations'>
                    <div>Nie masz jeszcze żadnych rezerwacji</div>
                    <button onClick={handleClick}>Zrób nową rezerwację</button>
                </div>
            )}
            {reservationsEmpty === false && (
                <div className='reservations'>
                    <h3>Twoje rezerwacje:</h3>
                    {reservations.map((reservation, index) => (
                        <div key={index}>
                            Data: {reservation.date}, Godzina: {reservation.time}, Adres: {reservation.restaurant.city}, ul.{reservation.restaurant.adress}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
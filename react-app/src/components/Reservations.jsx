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

    const handleDeleteClick = async (reservationObject) => {
        try {
            const { restaurant, date, time } = reservationObject;
            const id = restaurant.id;
            console.log(id);//debug
            console.log(reservationObject);//debug
            console.log('Dane wysyłane do usunięcia:', { id, date, time });//debug
            const response = await fetch("http://localhost:3000/api/reservations", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, date, time }),
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć rezerwacji');
            }

            const updatedReservations = reservations.filter((r) => 
                !(r.restaurant.id === restaurant.id && r.date === date && r.time === time)
            );
            setReservations(updatedReservations);
            localStorage.setItem('reservations', JSON.stringify(updatedReservations));
            
            if (updatedReservations.length === 0) {
                setReservationsEmpty(true);
            }
        } catch (error) {
            console.error(error);
            alert('Wystąpił błąd podczas usuwania rezerwacji');
        }
    }

    const handleChangeClick = (reservationObject) => {
        localStorage.setItem('modified', JSON.stringify("true"));
        handleDeleteClick(reservationObject);
        navigate(`/calendar/${reservationObject.restaurant.id}`);
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
                    <ul>
                        {reservations.map((reservation, index) => (
                            <li key={index}>
                                <div>
                                    <b>Restauracja:</b> {reservation.restaurant.name}, <b>Data: </b>{reservation.date}, <b>Godzina:</b> {reservation.time}, <b>Adres:</b> {reservation.restaurant.city}, ul.{reservation.restaurant.adress}
                                </div>
                                <button onClick={() => handleDeleteClick(reservation)}>Usuń</button>
                                <button onClick={() => handleChangeClick(reservation)}>Zmień</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
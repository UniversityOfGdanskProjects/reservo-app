import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminReservations() {
    const [reservations, setReservations] = useState([]);
    const [reservationsEmpty, setReservationsEmpty] = useState(true);

    useEffect(() => {
        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            console.log("res" + reservations);//debug
            console.log(reservations[0].userId);//debug
            setReservations(reservations);
            if (reservations.length >= 1) {
                setReservationsEmpty(false);
            }
        }
    }, []); 

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
                    <div>Nie ma żadnych rezerwacji</div>
                </div>
            )}
            {reservationsEmpty === false && (
                <div className='reservations'>
                    <h3>Rezerwacje:</h3>
                    <ul>
                        {reservations.map((reservation, index) => (
                            <li key={index}>
                                <div>
                                    <b> Restauracja:</b> {reservation.restaurant.name}, 
                                    <b> Data: </b>{reservation.date}, 
                                    <b> Godzina:</b> {reservation.time}, 
                                    <b> ID restauracji:</b> {reservation.restaurant.id} ,
                                    <b> ID użytkownika:</b> {reservation.userId}
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
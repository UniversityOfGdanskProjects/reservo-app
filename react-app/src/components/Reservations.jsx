import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [expiredReservations, setExpiredReservations] = useState([]);
    const [reservationsEmpty, setReservationsEmpty] = useState(true);
    const [message, setMessage] = useState("Pokaż historię rezerwacji");
    const [showHistory, setShowHistory] = useState(false);
    const currentUserId = localStorage.getItem('currentUserId');

    const fetchReservations = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/reservations');
            if (!response.ok) {
                throw new Error('Nie udało się pobrać rezerwacji');
            }
            const data = await response.json();
            const filtered = data.filter((reservation) => reservation.userId == currentUserId);
            const reservationsWithStatus = filtered.map((el) => {
                const { restaurant, date, time, userId } = el;
                console.log(el.restaurant)//debug
                const [hour, minute] = el.time.split(':').map(Number);
                const reservationDate = new Date(el.date); 
                reservationDate.setHours(hour, minute, 0, 0);
                const today = new Date();
                console.log(today);//debug
                today.setHours(0, 0, 0, 0);
                console.log(today);
                console.log(reservationDate);
                let status = 'active'
                if (reservationDate >= today) {
                    status = 'active';
                  } else {
                    status = 'expired';
                  }
                const reservation = {restaurant, date, time, userId, status};
                return reservation;
            });
            console.log(reservationsWithStatus[0].status);//debug
            const activeReservations = reservationsWithStatus.filter((r) => r.status === 'active');
            setReservations(activeReservations);
            const expReservations = reservationsWithStatus.filter((r) => r.status === 'expired');
            setExpiredReservations(expReservations);
            if (activeReservations.length >= 1) {
                setReservationsEmpty(false);
            }
        } catch (error) {
            console.log('Błąd podczas pobierania rezerwacji:', error);
        }
      };

    useEffect(() => {
        fetchReservations();
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
        handleDeleteClick(reservationObject);
        navigate(`/calendar/${reservationObject.restaurant.id}`);
    }

    const handleHistoryClick = () => {
        if (showHistory === false) {
            setShowHistory(true);
            setMessage("Zamknij historię rezerwacji");
        }
        else {
            setShowHistory(false);
            setMessage("Pokaż historię rezerwacji");
        }
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
            <button onClick={handleHistoryClick}>{message}</button>
            {showHistory == true && (
                <ul>
                    {expiredReservations.map((reservation, index) => (
                        <li key={index}>
                            <div>
                                <b>Restauracja:</b> {reservation.restaurant.name}, <b>Data: </b>{reservation.date}, <b>Godzina:</b> {reservation.time}, <b>Adres:</b> {reservation.restaurant.city}, ul.{reservation.restaurant.adress}, <div className='expired'>wygasła</div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Reservations.css';

export default function AdminReservations() {
    const [reservations, setReservations] = useState([]);
    const [reservationsEmpty, setReservationsEmpty] = useState(true);
    const currentUserId = localStorage.getItem('currentUserId');
    const user = JSON.parse(localStorage.getItem(`user_${currentUserId}`));
    const userEmail = user.email;
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [loading, setLoading] = useState("Ładowanie...");

    const fetchAdmins = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/admins');
            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych adminów');
            }
            const data = await response.json();
            const isAdmin = data.includes(userEmail);
            setIsUserAdmin(isAdmin);
        } catch (error) {
            console.log('Błąd podczas pobierania danych adminów:', error);
        }
      };

    useEffect(() => {
        const initialize = async () => {
            await fetchAdmins();
            if (currentUserId) {
                setLoading("");
            }
        }
        initialize();
    }, []); 

    const fetchReservations = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/reservations');
            if (!response.ok) {
                throw new Error('Nie udało się pobrać rezerwacji');
            }
            const data = await response.json();
            const reservationsWithStatus = data.map((el) => {
                const { restaurant, date, time, userId } = el;
                const [hour, minute] = el.time.split(':').map(Number);
                const reservationDate = new Date(el.date); 
                reservationDate.setHours(hour, minute, 0, 0);
                const today = new Date();
                let status = 'active'
                if (reservationDate >= today) {
                    status = 'active';
                  } else {
                    status = 'expired';
                  }
                const reservation = {restaurant, date, time, userId, status};
                return reservation;
            });
            setReservations(reservationsWithStatus);
            if (reservationsWithStatus.length >= 1) {
                setReservationsEmpty(false);
            }
        } catch (error) {
            console.log('Błąd podczas pobierania rezerwacji:', error);
        }
      };

    useEffect(() => {
        fetchReservations();
    }, []); 

    const handleDeleteClick = async (reservationObject) => {
        try {
            const { restaurant, date, time } = reservationObject;
            const id = restaurant.id;
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
            console.log(error);
            alert('Wystąpił błąd podczas usuwania rezerwacji');
        }
    }

    const handleChangeClick = (reservationObject) => {
        localStorage.setItem('modified', JSON.stringify("true"));
        handleDeleteClick(reservationObject);
        navigate(`/calendar/${reservationObject.restaurant.id}`);
    }

    return (
        <>
            {loading}
            {isUserAdmin === true && (
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
                                            <b> ID restauracji:</b> {reservation.restaurant.id},
                                            <b> ID użytkownika:</b> {reservation.userId},
                                            <b> Status: </b>
                                            <span className={reservation.status === 'active' ? 'active' : 'expired'}>
                                                {reservation.status}
                                            </span>
                                        </div>
                                        <button onClick={() => handleDeleteClick(reservation)}>Usuń</button>
                                        <button onClick={() => handleChangeClick(reservation)}>Zmień</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            {isUserAdmin === false && <div>Dostęp tylko dla administratorów</div>}
        </>
    );
}
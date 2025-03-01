import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Reservations.css';
import emailjs from 'emailjs-com';

export default function Reservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [expiredReservations, setExpiredReservations] = useState([]);
    const [reservationsEmpty, setReservationsEmpty] = useState(true);
    const [message, setMessage] = useState("Pokaż historię rezerwacji");
    const [showHistory, setShowHistory] = useState(false);
    const currentUserId = localStorage.getItem('currentUserId');
    const user = JSON.parse(localStorage.getItem(`user_${currentUserId}`));
    const userEmail = user.email

    const sendEmail = async (toEmail, reservation) => {
        const templateParams = {
            to_email: toEmail,                           
            restaurant_name: reservation.restaurant.name, 
            reservation_date: reservation.date,     
            reservation_time: reservation.time,  
        };

        try {
            const response = await emailjs.send(
                'service_yvqvc86',  
                'template_e20ndjp', 
                templateParams,
                '0zNaibg2kPW4j-Cuv' 
            );
            

            console.log('Email wysłany:', response.status, response.text);
        } catch (error) {
            console.log('Błąd wysyłania maila:', error);
        }
    };

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
                const [hour, minute] = el.time.split(':').map(Number);
                const reservationDate = new Date(el.date); 
                reservationDate.setHours(hour, minute, 0, 0);
                const today = new Date();
                let status = 'active';
                if (reservationDate >= today) {
                    status = 'active';
                  } else {
                    status = 'expired';
                  }
                const reservation = {restaurant, date, time, userId, status};
                return reservation;
            });
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
            sendEmail(userEmail, reservationObject);
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
                <div className='reservations'>
                    <ul>
                        {expiredReservations.map((reservation, index) => (
                            <li key={index}>
                                <div>
                                    <b>Restauracja:</b> {reservation.restaurant.name}, <b>Data: </b>{reservation.date}, <b>Godzina:</b> {reservation.time}, <b>Adres:</b> {reservation.restaurant.city}, ul.{reservation.restaurant.adress}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
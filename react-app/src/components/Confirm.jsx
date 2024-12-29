import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Confirm() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [name, setName] = useState("");
    const [adress, setAdress] = useState("");
    const [timer, setTimer] = useState(30); 
    const [city, setCity] = useState("");
    const [restaurant, setRestaurant] = useState("");
    const [status, setStatus] = useState("pending"); 
    const [id, setId] = useState("");
    const navigate = useNavigate();
    const deposit = 10; //zamienic na dane z localstorage

    useEffect(() => {
        localStorage.setItem('deposit', JSON.stringify(10));//zamienic na depozyt danej restauracji
        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            const reservation = reservations[reservations.length - 1];
            setDate(reservation.date);
            setTime(reservation.time);
            setCity(reservation.restaurant.city);
            setName(reservation.restaurant.name);
            setAdress(reservation.restaurant.adress);
            setRestaurant(reservation.restaurant);
            setId(reservation.id);
        }
    }, []);

    useEffect(() => {
        if (status === "pending" && timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(countdown);
        }

        if (timer === 0 && status === "pending") {
            handleCancel();
        }
    }, [timer, status]);

    const handleConfirm = () => {

        navigate('/payment');
    };

    const handleCancel = async () => {
        setStatus("cancelled");

        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            const updatedReservations = reservations.filter(r => r.restaurant !== restaurant || r.date !== date || r.time !== time);
            localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        }

        try {
            console.log('Dane wysyłane do usunięcia:', { id, date, time });//debug
            const response = await fetch('http://localhost:3000/api/reservations', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, date, time }),
            });

            if (!response.ok) {
                console.error("Błąd podczas anulowania rezerwacji:", await response.text());
            }
        } catch (error) {
            console.error("Błąd podczas anulowania rezerwacji:", error);
        }
    };

    return (
        <div className="confirm-reservation">
            <h2>Potwierdź rezerwację</h2>
            <div>Miejsce: {name}, {city}</div>
            <div>Adres: {adress}</div>
            <div>Data: {date}</div>
            <div>Godzina: {time}</div>
            <div>Kwota depozytu: {deposit},00 zł</div>
            {status === "pending" && (
                <div>
                    <div>
                        Pozostały czas na potwierdzenie: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </div>
                    <button onClick={handleConfirm}>Potwierdź i wpłać depozyt</button>
                    <button onClick={handleCancel}>Anuluj</button>
                </div>
            )}
            {status === "cancelled" && <div>Rezerwacja została anulowana.</div>}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Confirm() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [timer, setTimer] = useState(30); // 5 minut w sekundach
    const [status, setStatus] = useState("pending"); // pending, confirmed, cancelled
    const navigate = useNavigate();

    useEffect(() => {
        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            const reservation = reservations[reservations.length - 1];
            setDate(reservation.date);
            setTime(reservation.time);
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
        setStatus("confirmed");
        alert("Rezerwacja została potwierdzona!");
        navigate('/success');
    };

    const handleCancel = async () => {
        setStatus("cancelled");

        // Usuń rezerwację z localStorage
        const storedReservations = localStorage.getItem('reservations');
        if (storedReservations) {
            const reservations = JSON.parse(storedReservations);
            const updatedReservations = reservations.filter(r => r.date !== date || r.time !== time);
            localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        }

        // Wyślij żądanie anulowania do backendu
        try {
            const response = await fetch('http://localhost:3000/api/reservations', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date, time }),
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
            <div>Miejsce:</div>
            <div>Data: {date}</div>
            <div>Godzina: {time}</div>
            {status === "pending" && (
                <div>
                    <div>
                        Pozostały czas na potwierdzenie: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </div>
                    <button onClick={handleConfirm}>Potwierdź i wpłać depozyt</button>
                    <button onClick={handleCancel}>Anuluj</button>
                </div>
            )}
            {status === "confirmed" && <div>Rezerwacja potwierdzona. Dziękujemy za wpłatę!</div>}
            {status === "cancelled" && <div>Rezerwacja została anulowana.</div>}
        </div>
    );
}

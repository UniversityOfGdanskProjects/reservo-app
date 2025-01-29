import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Confirm.css';

export default function Confirm() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [name, setName] = useState("");
    const [adress, setAdress] = useState("");
    const [timer, setTimer] = useState(30); 
    const [city, setCity] = useState("");
    const [restaurant, setRestaurant] = useState("");
    const [status, setStatus] = useState("pending"); 
    const [deposit, setDeposit] = useState(0);
    const [defaultDeposit, setDefaultDeposit] = useState(0);
    const [id, setId] = useState(0);
    const [discountCode, setDiscountCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const currentUserId = localStorage.getItem("currentUserId");
        const storedReservations = localStorage.getItem('reservations');
        const pendingReservation = localStorage.getItem(`pending-reservation-${currentUserId}`);
        if (pendingReservation) {
            const reservation = JSON.parse(pendingReservation);
            setDate(reservation.date);
            setTime(reservation.time);
            setCity(reservation.restaurant.city);
            setName(reservation.restaurant.name);
            setAdress(reservation.restaurant.adress);
            setRestaurant(reservation.restaurant);
            setDeposit(reservation.restaurant.deposit);
            setDefaultDeposit(reservation.restaurant.deposit);
            setId(reservation.restaurant.id);
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
        localStorage.setItem('deposit', deposit);
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
            const response = await fetch('http://localhost:3000/api/reservations', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, date, time }),
            });

            if (!response.ok) {
                console.log("Błąd podczas anulowania rezerwacji:", await response.text());
            }
        } catch (error) {
            console.log("Błąd podczas anulowania rezerwacji:", error);
        }
    };

    const handleDiscountClick = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/discount-codes');
          if (!response.ok) {
            throw new Error('Nie udało się pobrać danych kodów rabatowych');
          }
          const data = await response.json();
          const isDiscountCode = data.includes(discountCode);
          if (isDiscountCode) {
            setMessage("");
            if (discountCode.includes("10")) {
                setDeposit(defaultDeposit * 0.9);
            } else if (discountCode.includes("20")) {
                setDeposit(defaultDeposit * 0.8);
            } else {
                setMessage("Błędny kod rabatowy");
            }
          } else {
            setMessage("Błędny kod rabatowy");
          }
        } catch (error) {
          console.log('Błąd podczas pobierania danych kodów rabatowych:', error);
        } 
      };

    return (
        <div className="confirm-reservation">
            <h2>Potwierdź rezerwację</h2>
            <div><b>Miejsce:</b> {name}, {city}</div>
            <div><b>Adres:</b> {adress}</div>
            <div><b>Data:</b> {date}</div>
            <div><b>Godzina:</b> {time}</div>
            <div><b>Kwota depozytu:</b> {deposit},00 zł</div>
            <div className='discount-code'>
                <div className='message'>{message}</div>
                <div className='input-area'>
                    <input placeholder="Mam kod rabatowy" onChange={(e) => setDiscountCode(e.target.value)}/>
                    <button onClick={handleDiscountClick}>Zatwierdź</button>
                </div>
            </div>
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

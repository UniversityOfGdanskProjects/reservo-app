import React, { useEffect } from 'react';
import emailjs from 'emailjs-com';

const ReservationNotifications = () => {
    const sendEmail = async (toEmail, reservation) => {
        const templateParams = {
            to_email: toEmail,                           // Dynamiczny adres e-mail użytkownika
            restaurant_name: reservation.restaurant.name, // Nazwa restauracji
            reservation_date: reservation.date,           // Data rezerwacji
            reservation_time: reservation.time,           // Godzina rezerwacji
            restaurant_city: reservation.restaurant.city, // Miasto restauracji
            restaurant_address: reservation.restaurant.adress // Adres restauracji
        };

        try {
            const response = await emailjs.send(
                'service_yvqvc86',  // Twój Service ID z EmailJS
                'template_u9x6etr', // Twój Template ID
                templateParams,
                '0zNaibg2kPW4j-Cuv' // Twój Public Key (User ID)
            );
            

            console.log('Email wysłany:', response.status, response.text);
        } catch (error) {
            console.error('Błąd wysyłania maila:', error);
        }
    };

    const checkReservations = async (reservations) => {
        console.log("sprawdzam rezerwacje...")//debug
        const now = new Date();

        for (const reservation of reservations) {
            const reservationDateTime = new Date(`${reservation.date} ${reservation.time}`);
            const timeDifference = reservationDateTime - now;

            // Sprawdzamy, czy rezerwacja przypada za godzinę
            if (timeDifference > 0 && timeDifference == 3600000) {
                try {
                    // Pobieramy adres e-mail użytkownika (przy założeniu, że jest w reservation.userEmail)
                    const userEmail = await fetchUserEmail(reservation.userId);

                    // Wysyłamy e-mail
                    await sendEmail(userEmail, reservation);
                } catch (error) {
                    console.error('Błąd w procesie sprawdzania rezerwacji:', error);
                }
            }
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/reservations');
            if (!response.ok) {
                throw new Error('Nie udało się pobrać rezerwacji');
            }

            const reservations = await response.json();
            await checkReservations(reservations);
        } catch (error) {
            console.error('Błąd podczas pobierania rezerwacji:', error);
        }
    };

    const fetchUserEmail = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/users`);
            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych użytkownika');
            }

            const users = await response.json();
            const user = users.find(user => user.id == userId);
            console.log(user.email);//debug
            return user.email; // Zwracamy e-mail użytkownika
        } catch (error) {
            console.error('Błąd podczas pobierania e-maila użytkownika:', error);
            return null;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchReservations();
        }, 60000); // Sprawdzamy rezerwacje co minutę

        return () => clearInterval(interval);
    }, []);

    return null; // Ten komponent działa tylko w tle
};

export default ReservationNotifications;

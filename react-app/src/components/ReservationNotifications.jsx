import React, { useEffect } from 'react';
import emailjs from 'emailjs-com';

const ReservationNotifications = () => {
    const sendEmail = async (toEmail, reservation) => {
        const templateParams = {
            to_email: toEmail,                           
            restaurant_name: reservation.restaurant.name, 
            reservation_date: reservation.date,     
            reservation_time: reservation.time,  
            restaurant_city: reservation.restaurant.city, 
            restaurant_address: reservation.restaurant.adress 
        };

        try {
            const response = await emailjs.send(
                'service_yvqvc86',  //serviceID
                'template_u9x6etr', //templateID
                templateParams,
                '0zNaibg2kPW4j-Cuv' //Public Key
            );
            

            console.log('Email wysłany:', response.status, response.text);
        } catch (error) {
            console.error('Błąd wysyłania maila:', error);
        }
    };

    const checkReservations = async (reservations) => {
        const now = new Date();
    
        const tasks = reservations.map(async (reservation) => {
            const reservationDateTime = new Date(`${reservation.date} ${reservation.time}`);
            const timeDifference = reservationDateTime - now;
    
            if (timeDifference > 0 && timeDifference <= 3600000 && timeDifference >= 3500000) {
                try {
                    const userEmail = await fetchUserEmail(reservation.userId);
                    await sendEmail(userEmail, reservation);
                } catch (error) {
                    console.error('Błąd w procesie sprawdzania rezerwacji:', error);
                }
            }
        });
    
        await Promise.all(tasks);
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
            console.log('Błąd podczas pobierania rezerwacji:', error);
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
            return user.email;
        } catch (error) {
            console.log('Błąd podczas pobierania e-maila użytkownika:', error);
            return null;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchReservations();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return null; 
};

export default ReservationNotifications;

import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
    const navigate = useNavigate();

    const handleReservationsClick = () => {
        navigate('/admin-reservations');
    };

    const handleUsersClick = () => {
        navigate('/admin-users');
    }

    const handleRestaurantsClick = () => {
        navigate('/admin-restaurants');
    }

    return (
        <div className='admin-panel'>
            <h2>Panel administratora</h2>
            <div className='button-container'>
                <button onClick={handleReservationsClick}>Zarządzaj rezerwacjami</button>
                <button onClick={handleUsersClick}>Zarządzaj użytkownikami</button>
                <button onClick={handleRestaurantsClick}>Zarządzaj restauracjami</button>
            </div>
        </div>
    )
}
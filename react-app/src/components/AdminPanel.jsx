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

    return (
        <div className='admin-panel'>
            <h2>Panel administratora</h2>
            <button onClick={handleReservationsClick}>Zarządzaj rezerwacjami</button>
            <button onClick={handleUsersClick}>Zarządzaj użytkownikami</button>
        </div>
    )
}
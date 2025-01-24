import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AdminPanel.css';
import GenerateReport from './GenerateReport';

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
                <GenerateReport 
                    apiEndpoint="http://localhost:3000/api/users" 
                    reportType="Użytkownicy" 
                    restaurantsEndpoint="http://localhost:3000/api/restaurants" 
                    reservationsEndpoint="http://localhost:3000/api/reservations" 
                />
                <GenerateReport 
                    apiEndpoint="http://localhost:3000/api/users" 
                    reportType="Rezerwacje" 
                    restaurantsEndpoint="http://localhost:3000/api/restaurants" 
                    reservationsEndpoint="http://localhost:3000/api/reservations" 
                />
            </div>
        </div>
    )
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Main.css'


export default function MainPage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    }

    return (
        <div className='main-page'>
           <h2>Witamy w reservo!</h2>
           <div>
                <button onClick={handleLoginClick}>Zaloguj się</button> aby skorzystać
            </div>
        </div>
    )
}
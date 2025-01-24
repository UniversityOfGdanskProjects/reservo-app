import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Header.css'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
    
    const navigate = useNavigate(); 
  
    const handleOpinionClick = () => {
      navigate('/rate-us');
    };

    const handleLoginClick = () => {
      setLoggedIn(true);
      navigate('/login');
    }

    const handleLogoutClick = () => {
      setLoggedIn(false);
      navigate('/');
    }
  
    return (
      <header>
        <div>reservo - menager rezerwacji w trójmieście</div>
        <div className='button-container'>
          {loggedIn === true && (
            <button onClick={handleLogoutClick}>
              Wyloguj się
            </button>
          )}
          {loggedIn === false && (
            <button onClick={handleLoginClick}>
              Zaloguj się
            </button>
          )}
          <button className="opinion" onClick={handleOpinionClick}>
            Oceń nas!
          </button>
        </div>
      </header>
    );
  }
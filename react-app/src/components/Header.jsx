import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './styles/Header.css';
import { FaHome } from 'react-icons/fa';

export default function Header() {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
    
    const navigate = useNavigate(); 
  
    const handleOpinionClick = () => {
      navigate('/rate-us');
    };

    const handleLoginClick = () => {
      navigate('/login');
    }

    const handleLogoutClick = () => {
      localStorage.removeItem('currentUserId');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('user_')) {
          localStorage.removeItem(key);
        }
      });
      setLoggedIn(false);
      navigate('/');
    }

    const handleHomeClick = () => {
      navigate('/home');
    }
  
    return (
      <header>
        {loggedIn === true && (
          <FaHome className='home-icon' onClick={handleHomeClick} />
        )}
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
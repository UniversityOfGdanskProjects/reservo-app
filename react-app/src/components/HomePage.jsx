import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const currentUserId = localStorage.getItem('currentUserId');
  const currentUser = JSON.parse(localStorage.getItem(`user_${currentUserId}`));

  const fetchAdmins = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/admins');
        if (!response.ok) {
            throw new Error('Nie udało się pobrać danych adminów');
        }
        const data = await response.json();
        if (currentUserId) {
          setUserInfo(currentUser);
          const isAdmin = data.includes(currentUser.email);
          if (isAdmin) {
            navigate('/admin-panel');
          }
        }

    } catch (error) {
        console.log('Błąd podczas pobierania danych adminów:', error);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      await fetchAdmins();
    };

    initialize();
  }, []); 

  const handleReservationsClick = () => {
    navigate('/reservations');
  }
  const handleMakeReservationClick = () => {
    navigate('/search');
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className='home'>
      {userInfo ? ( 
        <>
          <h1>Witaj, {capitalize(userInfo.firstName)} {capitalize(userInfo.lastName)}</h1>
          <div className='button-container'>
            <button onClick={handleReservationsClick}>Moje rezerwacje</button>
            <button onClick={handleMakeReservationClick}>Nowa rezerwacja</button>
          </div>
        </>
      ) : (
        <h1>Ładowanie danych użytkownika...</h1> 
      )}
    </div>
    
  );
}

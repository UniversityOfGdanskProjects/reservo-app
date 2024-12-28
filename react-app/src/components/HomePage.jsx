import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo)); 
    }
  }, []); 

  const handleCalendarClick = () => {
    navigate('/calendar');
  }
  const handleReservationsClick = () => {
    navigate('/reservations');
  }

  return (
    <div className='home'>
      {userInfo ? ( 
        <>
          <h1>Witaj, {userInfo.firstName} {userInfo.lastName}</h1>
          <div className='button-container'>
            <button onClick={handleCalendarClick}>Kalendarz</button>
            <button onClick={handleReservationsClick}>Moje rezerwacje</button>
            <button onClick={handleReservationsClick}>Moje rezerwacje</button> 
            <button onClick={handleReservationsClick}>Moje rezerwacje</button>
          </div>
        </>
      ) : (
        <h1>Ładowanie danych użytkownika...</h1> 
      )}
    </div>
    
  );
}

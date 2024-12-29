import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      const currentUser = JSON.parse(localStorage.getItem(`user_${currentUserId}`));
      console.log('Aktualny użytkownik:', currentUser);//debug
      setUserInfo(currentUser);
    }
    // const storedUserInfo = localStorage.getItem('userInfo');
    // if (storedUserInfo) {
    //     setUserInfo(JSON.parse(storedUserInfo)); 
    // }
  }, []); 

  const handleCalendarClick = () => {
    navigate('/calendar');
  }
  const handleReservationsClick = () => {
    navigate('/reservations');
  }
  const handleMakeReservationClick = () => {
    navigate('/search');
  }

  return (
    <div className='home'>
      {userInfo ? ( 
        <>
          <h1>Witaj, {userInfo.firstName} {userInfo.lastName}</h1>
          <div className='button-container'>
            <button onClick={handleCalendarClick}>Kalendarz</button>
            <button onClick={handleReservationsClick}>Moje rezerwacje</button>
            <button onClick={handleMakeReservationClick}>Nowa rezerwacja</button>
            <button onClick={handleReservationsClick}>Moje rezerwacje</button>
          </div>
        </>
      ) : (
        <h1>Ładowanie danych użytkownika...</h1> 
      )}
    </div>
    
  );
}

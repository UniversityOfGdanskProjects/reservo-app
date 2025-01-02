import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [admins, setAdmins] = useState([]);
  const currentUserId = localStorage.getItem('currentUserId');
  const currentUser = JSON.parse(localStorage.getItem(`user_${currentUserId}`));

  const fetchAdmins = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/admins');
        if (!response.ok) {
            throw new Error('Nie udało się pobrać danych adminów');
        }
        const data = await response.json();
        console.log('Pobrani admini:', data);//debug
        setAdmins(data);
        if (currentUserId) {
          console.log('Aktualny użytkownik:', currentUser);//debug
          setUserInfo(currentUser);
          const isAdmin = data.includes(currentUser.email);
          if (isAdmin) {
            console.log('Przenoszenie do panelu administratora');
            navigate('/admin-panel');
          }
        }

    } catch (error) {
        console.log('Błąd podczas pobierania danych adminów:', error);
    }
  };

  // const checkIfAdmin = (userEmail) => {
  //   const isAdmin = admins.includes(userEmail);
  //   return isAdmin;
  // };

  useEffect(() => {
    const initialize = async () => {
      await fetchAdmins();
      // const currentUserId = localStorage.getItem('currentUserId');
      // console.log(currentUserId);//debug
      // if (currentUserId) {
      //   const currentUser = JSON.parse(localStorage.getItem(`user_${currentUserId}`));
      //   console.log('Aktualny użytkownik:', currentUser);//debug
      //   setUserInfo(currentUser);

      //   if (checkIfAdmin(currentUser.email)) {
      //     console.log('Przenoszenie do panelu administratora');
      //     navigate('/admin-panel');
      //   }
      // }
    };

    initialize();
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

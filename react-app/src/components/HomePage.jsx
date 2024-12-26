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

  const handleClick = () => {
    navigate('/calendar');
  }

  return (
    <div>
      {userInfo ? ( 
        <>
          <h1>Witaj, {userInfo.firstName} {userInfo.lastName}</h1>
          <button onClick={handleClick}>Kalendarz</button>
        </>
      ) : (
        <h1>Ładowanie danych użytkownika...</h1> 
      )}
    </div>
    
  );
}

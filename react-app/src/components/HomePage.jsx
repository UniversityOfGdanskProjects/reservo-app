import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo)); 
    }
  }, []); 

  return (
    <div>
      {userInfo ? ( 
        <h1>Witaj, {userInfo.firstName} {userInfo.lastName}</h1>
      ) : (
        <h1>Ładowanie danych użytkownika...</h1> 
      )}
    </div>
  );
}

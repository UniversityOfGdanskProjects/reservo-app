import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/home'); // Przejdź do HomePage
  };

  return (
    <div className="registry-login">
      <button className="account" onClick={() => alert('Funkcja rejestracji w budowie')}>
        Utwórz konto
      </button>
      <button className="account" onClick={handleLoginClick}>
        Zaloguj się
      </button>
    </div>
  );
}
 
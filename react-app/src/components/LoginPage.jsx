import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/home'); 
  };

  const handleRegistryClick = () => {
    navigate('/registry');
  }

  return (
    <div className="registry-login">
      <div>
        <div>
          <input type="email" placeholder="adres email" id="email" name="email" required />
        </div>
        <div>
          <input type="password" placeholder="hasło" id="password" name="password" required />
        </div>
        <button className="login" onClick={handleLoginClick}>
          Zaloguj się
        </button>
      </div>
      <div>
        <button className="account" onClick={handleRegistryClick}>
          Utwórz konto
        </button>
      </div>
    </div>
  );
}
 
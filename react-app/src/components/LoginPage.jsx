import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  
  const handleRegistryClick = () => {
    navigate('/registry');
  }

  const handleLoginClick = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUserInfo(data); 
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/home');
    } else {
      alert('Błąd logowania.');
    }
  };

  return (
    <div className="registry-login">
      <p>Zaloguj się</p>
      <div>
        <input 
          type="email" 
          placeholder="adres email" 
          id="email" name="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>
      <div>
        <input 
          type="password" 
          placeholder="hasło" 
          id="password" 
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>
      <button className="login" onClick={handleLoginClick}>
        Zaloguj się
      </button>
      <button className="account" onClick={handleRegistryClick}>
        Utwórz konto
      </button>
    </div>
  );
}
 
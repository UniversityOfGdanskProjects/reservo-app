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

  const handleLoginClick = async () => {

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUserInfo(data); 
      console.log(data);//debug
      localStorage.setItem(`user_${data.id}`, JSON.stringify(data));
      localStorage.setItem('currentUserId', data.id);
      navigate('/home');
    } else {
      alert("Email i hasło nie są prawidłowe");
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
 
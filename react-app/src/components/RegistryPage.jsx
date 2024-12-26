import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function RegistryPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault(); 
    
        if (password === repeatPassword) {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName: name, 
                    lastName,        
                }),
            });
    
            if (response.ok) {
                setMessage('Rejestracja zakończona sukcesem! Zaloguj się, aby przejść do systemu.')
            } else {
                setMessage('Coś poszło nie tak. Spróbuj ponownie.');
            }
        } else {
            alert('Proszę wpisać dwa razy to samo hasło!');
        }
    };

    const handleLogIn = () => {
        navigate('/');
    }
    

    return (
        <div className="registry-page">
            <h1>Zarejestruj się</h1>
            {message && <p>{message}</p>} 
            <button className="login-button" onClick={handleLogIn}>Zaloguj się</button>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="firstName">Imię:</label>
                    <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Nazwisko:</label>
                    <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="email">Adres Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"    
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div>
                    <label htmlFor="password">Hasło:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Powtórz Hasło:</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit">Zarejestruj się</button>
            </form>
        </div>
      );
  }
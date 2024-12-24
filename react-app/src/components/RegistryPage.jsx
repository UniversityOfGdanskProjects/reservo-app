import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistryPage() {
    return (
        <div className="registry-page">
          <h1>Zarejestruj się</h1>
          <form onSubmit={() => console.log("TODO")}>
            <div>
                <label htmlFor="firstName">Imię:</label>
                <input type="text" id="firstName" name="firstName" required />
            </div>
            <div>
                <label htmlFor="lastName">Nazwisko:</label>
                <input type="text" id="lastName" name="lastName" required />
            </div>
            <div>
                <label htmlFor="email">Adres Email:</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div>
                <label htmlFor="password">Hasło:</label>
                <input type="password" id="password" name="password" required />
            </div>
            <div>
                <label htmlFor="confirmPassword">Powtórz Hasło:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required />
            </div>
            <button type="submit">Zarejestruj się</button>
          </form>
        </div>
      );
  }
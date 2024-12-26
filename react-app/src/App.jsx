import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RegistryPage from './components/RegistryPage';
import Calendar from './components/Calendar';
import Confirm from './components/Confirm';

function App() {
  return (
    <Router>
      <header>Schedulo - your personal reservation manager</header>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/registry" element={<RegistryPage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/confirm-reservation" element={<Confirm />} />
      </Routes>
    </Router>
  );
}

export default App;

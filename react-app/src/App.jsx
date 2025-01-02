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
import Payment from './components/Payment';
import Reservations from './components/Reservations';
import Search from './components/Search';
import AdminPanel from './components/AdminPanel';
import AdminReservations from './components/AdminReservations';
import AdminUsers from './components/AdminUsers';
import AdminRestaurants from './components/AdminRestaurants';


function App() {
  return (
    <Router>
      <header>
        Schedulo - your personal reservation manager
      </header>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/registry" element={<RegistryPage />} />
        <Route path="/calendar/:id" element={<Calendar />} />
        <Route path="/confirm-reservation" element={<Confirm />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/admin-reservations" element={<AdminReservations />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-restaurants" element={<AdminRestaurants />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';

export default function BookingCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableHours, setAvailableHours] = useState([
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00',
    '19:30', '20:00',
  ]);
  const [reservations, setReservations] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/reservations')
      .then((response) => response.json())
      .then((data) => setReservations(data))
      .catch((error) => console.error('Błąd podczas pobierania rezerwacji:', error));
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleHourClick = (hour) => {
    setSelectedTime(hour);
  };

  const handleReservationSubmit = () => {
    if (!selectedDate || !selectedTime) {
      alert('Proszę wybrać datę i godzinę.');
      return;
    }

    const reservation = {
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
    };

    fetch('http://localhost:3000/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    })
      .then((response) => {
        if (response.ok) {
          //alert('Rezerwacja została zapisana.');
          setReservations([...reservations, reservation]);
          localStorage.setItem('reservations', JSON.stringify(reservations));
          navigate('/confirm-reservation');
        } else if (response.status === 409) {
          alert('Ten termin jest już zajęty.');
        } else {
          alert('Wystąpił błąd podczas zapisywania rezerwacji.');
        }
      })
      .catch((error) => console.error('Błąd podczas zapisywania rezerwacji:', error));
  };

  const getFilteredHours = () => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const takenHours = reservations
      .filter((res) => res.date === selectedDateString)
      .map((res) => res.time);

    return availableHours.filter((hour) => !takenHours.includes(hour));
  };

  return (
    <div className="calendar">
      <h1>Wybierz termin rezerwacji</h1>
      <Calendar 
        onChange={handleDateChange} 
        value={selectedDate} 
        minDate={new Date()} 
      />
      {selectedDate && (
        <div>
          <p>Wybrałeś datę: {selectedDate.toLocaleDateString()}</p>
          <ul className="hours">
            <h3>Dostępne godziny:</h3>
            {getFilteredHours().map((hour) => (
              <li key={hour}>
                <button 
                  onClick={() => handleHourClick(hour)}
                  className={selectedTime === hour ? 'selected' : ''}
                >
                  {hour}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={handleReservationSubmit}>
            Zarezerwuj
          </button>
        </div>
      )}
    </div>
  );
}

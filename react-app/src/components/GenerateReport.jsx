import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "../fonts/Roboto-Italic-VariableFont_wdth,wght-normal.js"

const GenerateReport = ({ apiEndpoint, reportType, reservationsEndpoint, restaurantsEndpoint }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(restaurantsEndpoint);
        if (!res.ok) {
          throw new Error("Nie udało się pobrać restauracji");
        }

        const data = await res.json();
        setRestaurants(data); 
      } catch (error) {
        console.error("Błąd pobierania restauracji:", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const res = await fetch(reservationsEndpoint);
        if (!res.ok) {
          throw new Error("Nie udało się pobrać rezerwacji");
        }

        const data = await res.json();
        setReservations(data);  
      } catch (error) {
        console.error("Błąd pobierania rezerwacji:", error);
      }
    };

    fetchRestaurants();
    fetchReservations();
  }, [restaurantsEndpoint, reservationsEndpoint]);

  const isToday = (date) => {
    const today = new Date();
    const reservationDate = new Date(date);
    
    return (
      today.getDate() === reservationDate.getDate() &&
      today.getMonth() === reservationDate.getMonth() &&
      today.getFullYear() === reservationDate.getFullYear()
    );
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();

      doc.setFont('Roboto-Italic-VariableFont_wdth,wght', 'normal');
      doc.setFontSize(12);

      if (reportType === "Użytkownicy") {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania użytkowników");
        }

        const data = await response.json();

        doc.setFontSize(16);
        doc.text(`Raport użytkowników:`, 10, 10);
        doc.setFontSize(12);
        doc.text(`Liczba użytkowników: ${data.length}`, 10, 20);
        doc.text(`Lista użytkowników:`, 10, 30);

        let yOffset = 40;
        data.forEach((user, index) => {
          doc.text(
            `${index + 1}. Imię: ${user.firstName}, Nazwisko: ${user.lastName}, Email: ${user.email}`,
            10,
            yOffset
          );
          yOffset += 10;
        });
      } else if (reportType === "Rezerwacje") {
        const reservationsCount = restaurants.map(restaurant => {
          const reservationsForRestaurant = reservations.filter(
            reservation => reservation.restaurant.name === restaurant.name && isToday(reservation.date)
          );

          return {
            name: restaurant.name,
            city: restaurant.city,
            count: reservationsForRestaurant.length,
          };
        });

        doc.setFontSize(16);
        doc.text(`Raport rezerwacji:`, 10, 10);
        doc.setFontSize(12);
        const today = new Date();
        const formattedDate = today.toLocaleDateString('pl-PL');
        doc.text(`Ilosc rezerwacji w wymienionych restauracjach w dniu ${formattedDate}:`, 10, 20);

        let yOffset = 30;
        reservationsCount.forEach((restaurant) => {
          doc.text(
            `${restaurant.name} (${restaurant.city}): ${restaurant.count}`,
            10,
            yOffset
          );
          yOffset += 10;
        });
      }

      doc.save(`${reportType}_Raport.pdf`);
    } catch (error) {
      console.log("Błąd generowania raportu:", error);
    }
  };

  return (
    <button onClick={generatePDF}>
      Pobierz raport: {reportType}
    </button>
  );
};

export default GenerateReport;

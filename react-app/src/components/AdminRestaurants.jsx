import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRestaurants() {
    const currentUserId = localStorage.getItem('currentUserId');
    const user = JSON.parse(localStorage.getItem(`user_${currentUserId}`));
    const userEmail = user.email;
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [loading, setLoading] = useState("Ładowanie danych...");
    const [restaurants, setRestaurants] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [adress, setAdress] = useState('');
    const [deposit, setDeposit] = useState('');

    const fetchAdmins = async () => {
        try {
            setLoading("Ładowanie danych...");
            const response = await fetch('http://localhost:3000/api/admins');
            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych adminów');
            }
            const data = await response.json();
            console.log('Pobrani admini:', data);//debug
            const isAdmin = data.includes(userEmail);
            setIsUserAdmin(isAdmin);
        } catch (error) {
            console.log('Błąd podczas pobierania danych adminów:', error);
        } finally {
            setLoading("");
        }
      };

    useEffect(() => {
        const initialize = async () => {
            await fetchAdmins();
        }
        initialize();
    }, []); 

    const fetchRestaurants = async () => {
        try {
            setLoading("Ładowanie danych...")
            const response = await fetch('http://localhost:3000/api/restaurants');
            if (!response.ok) {
                throw new Error('Nie udało się pobrać restauracji');
            }
            const data = await response.json();
            setRestaurants(data);
            console.log("restauracja", data[0]);//debug
        } catch (error) {
            console.log('Błąd podczas pobierania restauracji:', error);
        } finally {
            setLoading("");
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleDeleteClick = async (id) => {
        try {
            const response = await fetch('http://localhost:3000/api/restaurants', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć restauracji');
            }

            setRestaurants(prevRestaurants => prevRestaurants.filter(restaurant => restaurant.id !== id));
            console.log('Restauracja została usunięta');
        } catch (error) {
            console.log('Błąd podczas usuwania restauracji:', error);
        }
    };

    const handleNewRestaurantClick = () => {
        setClicked(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newRestaurant = {
          name,
          city,
          adress,
          deposit: parseFloat(deposit), 
        };
    
        try {
          const response = await fetch('http://localhost:3000/api/restaurants', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRestaurant),
          });
    
          if (!response.ok) {
            throw new Error('Nie udało się dodać restauracji');
          }
          
          console.log('Restauracja została dodana!');
          setName('');
          setCity('');
          setAdress('');
          setDeposit('');
          fetchRestaurants();
          setClicked(false);
        } catch (error) {
          console.error('Błąd:', error);
        }
      };

    return (
        <>
            <div>{loading}</div>
            {isUserAdmin === false && <div>Dostęp tylko dla administratorów</div>}
            {isUserAdmin === true && (
                <>
                    <div className='user-list'>
                        <h2>Lista restauracji:</h2>
                        {restaurants.map((restaurant, index) => (
                            <div key={index}>
                                <b> Nazwa: </b> {restaurant.name}
                                <b> Adres: </b> {restaurant.city}, {restaurant.adress}
                                <b> Kwota depozytu: </b> {restaurant.deposit},00zł
                                <b> ID: </b> {restaurant.id}
                                <button onClick={() => handleDeleteClick(restaurant.id)}>Usuń restaurację</button>
                            </div>
                        ))}
                    </div>
                    <div className='new-restaurant'>
                        <button onClick={handleNewRestaurantClick}>Dodaj nową restaurację</button>
                        {clicked && (
                            <form onSubmit={handleSubmit}>
                                <div>
                                <label htmlFor="name">Nazwa restauracji:</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                </div>
                                <div>
                                <label htmlFor="city">Miasto:</label>
                                <input
                                    type="text"
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                                </div>
                                <div>
                                <label htmlFor="adress">Adres:</label>
                                <input
                                    type="text"
                                    id="adress"
                                    value={adress}
                                    onChange={(e) => setAdress(e.target.value)}
                                    required
                                />
                                </div>
                                <div>
                                <label htmlFor="deposit">Depozyt:</label>
                                <input
                                    type="number"
                                    id="deposit"
                                    value={deposit}
                                    onChange={(e) => setDeposit(e.target.value)}
                                    required
                                />
                                </div>
                                <button type="submit">Dodaj Restaurację</button>
                            </form>
                        )}
                    </div>
                </>
            )}
        </>
    )
}
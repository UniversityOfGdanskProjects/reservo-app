import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filteredRestaurants = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchText.toLowerCase()) ||
        restaurant.city.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        fetch('http://localhost:3000/api/restaurants')
          .then((response) => {
            if (!response.ok) {
              throw new Error('Błąd sieci: ' + response.status);
            }
            return response.json(); 
          })
          .then((data) => {
            setRestaurants(data); 
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
    }, []);

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/calendar/${restaurantId}`);
    };

    return (
    <>
        <div className='search-area'>
            {error && <div>Wystąpił błąd</div>}
            {loading && <div>Ładowanie...</div>}
            <input
                type="text"
                placeholder="Szukaj restauracji..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <ul>
                {filteredRestaurants.map((restaurant) => (
                <li key={restaurant.id} onClick={() => handleRestaurantClick(restaurant.id)}>
                    <h2>{restaurant.name}</h2>
                    <p>Miasto: {restaurant.city}</p>
                    <p>Adres: {restaurant.adress}</p>
                </li>
                ))}
            </ul>
        </div>
    </>
    );
}


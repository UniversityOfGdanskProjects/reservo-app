import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import './styles/AdminRestaurants.css';

export default function AdminRestaurants() {
  const currentUserId = localStorage.getItem('currentUserId');
  const user = JSON.parse(localStorage.getItem(`user_${currentUserId}`));
  const userEmail = user.email;
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState("Ładowanie danych...");
  const [restaurants, setRestaurants] = useState([]);
  const [clicked, setClicked] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading("Ładowanie danych...");
      const response = await fetch('http://localhost:3000/api/admins');
      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych adminów');
      }
      const data = await response.json();
      const isAdmin = data.includes(userEmail);
      setIsUserAdmin(isAdmin);
    } catch (error) {
      console.log('Błąd podczas pobierania danych adminów:', error);
    } finally {
      setLoading("");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading("Ładowanie danych...");
      const response = await fetch('http://localhost:3000/api/restaurants');
      if (!response.ok) {
        throw new Error('Nie udało się pobrać restauracji');
      }
      const data = await response.json();
      setRestaurants(data);
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
        body: JSON.stringify({ id }),
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
  };

  const handleSubmit = async (values) => {
    const { name, city, adress, deposit } = values;

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
          <div className='restaurant-list'>
            <h2>Lista restauracji:</h2>
            <ul>
                {restaurants.map((restaurant, index) => (
                    <li key={index}>
                        <div>
                            <b> Nazwa: </b> {restaurant.name}
                            <b> Adres: </b> {restaurant.city}, {restaurant.adress}
                            <b> Kwota depozytu: </b> {restaurant.deposit},00zł
                            <b> ID: </b> {restaurant.id}
                        </div>
                        <button onClick={() => handleDeleteClick(restaurant.id)}>Usuń restaurację</button>
                    </li>
                ))}
            </ul>
          </div>
          <div className='new-restaurant'>
            <button onClick={handleNewRestaurantClick}>Dodaj nową restaurację</button>
            {clicked && (
              <Formik
                initialValues={{
                  name: '',
                  city: '',
                  adress: '',
                  deposit: '',
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) errors.name = 'Wymagana nazwa restauracji';
                  if (!values.city) errors.city = 'Wymagane miasto';
                  if (!values.adress) errors.adress = 'Wymagany adres';
                  if (!values.deposit) errors.deposit = 'Wymagana kwota depozytu';
                  return errors;
                }}
                onSubmit={handleSubmit}
              >
                {({ values, handleChange, handleBlur, errors, touched }) => (
                  <Form className='restaurant-form'>
                    <div>
                      <label htmlFor="name">Nazwa restauracji:</label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      <ErrorMessage className="error-message" name="name" component="div" style={{ color: 'red' }} />
                    </div>

                    <div>
                      <label htmlFor="city">Miasto:</label>
                      <Field
                        type="text"
                        id="city"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      <ErrorMessage className="error-message" name="city" component="div" style={{ color: 'red' }} />
                    </div>

                    <div>
                      <label htmlFor="adress">Adres:</label>
                      <Field
                        type="text"
                        id="adress"
                        name="adress"
                        value={values.adress}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      <ErrorMessage className="error-message" name="adress" component="div" style={{ color: 'red' }} />
                    </div>

                    <div>
                      <label htmlFor="deposit">Depozyt:</label>
                      <Field
                        type="number"
                        id="deposit"
                        name="deposit"
                        value={values.deposit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      <ErrorMessage className="error-message" name="deposit" component="div" style={{ color: 'red' }} />
                    </div>

                    <button type="submit">Dodaj Restaurację</button>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </>
      )}
    </>
  );
}

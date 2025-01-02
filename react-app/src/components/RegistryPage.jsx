import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';

export default function RegistryPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleRegister = async (values) => {
    const { email, password, firstName, lastName } = values;
    
    if (values.password === values.confirmPassword) {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      if (response.ok) {
        setMessage('Rejestracja zakończona sukcesem! Zaloguj się, aby przejść do systemu.');
      } else {
        setMessage('Coś poszło nie tak. Spróbuj ponownie.');
      }
    } else {
      setMessage('Proszę wpisać dwa razy to samo hasło!');
    }
  };

  const handleLogIn = () => {
    navigate('/');
  };

  return (
    <div className="registry-page">
      <h1>Zarejestruj się</h1>
      {message && <p>{message}</p>} 
      <button className="login-button" onClick={handleLogIn}>Zaloguj się</button>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.firstName) {
            errors.firstName = 'Wymagane imię';
          }
          if (!values.lastName) {
            errors.lastName = 'Wymagane nazwisko';
          }
          if (!values.email) {
            errors.email = 'Wymagany adres email';
          } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Adres email jest nieprawidłowy';
          }
          if (!values.password) {
            errors.password = 'Wymagane hasło';
          }
          if (!values.confirmPassword) {
            errors.confirmPassword = 'Wymagane potwierdzenie hasła';
          } else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Hasła muszą być takie same';
          }
          return errors;
        }}
        onSubmit={handleRegister}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
            <div>
              <Field 
                type="text" 
                id="firstName" 
                placeholder="Imię"
                name="firstName" 
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              <ErrorMessage name="firstName" component="div" style={{ color: 'red' }} />
            </div>

            <div>
              <Field 
                type="text" 
                id="lastName" 
                placeholder="Nazwisko"
                name="lastName" 
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              <ErrorMessage name="lastName" component="div" style={{ color: 'red' }} />
            </div>

            <div>
              <Field 
                type="email" 
                id="email" 
                placeholder="Adres email"
                name="email" 
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
            </div>

            <div>
              <Field 
                type="password" 
                id="password" 
                placeholder="Hasło"
                name="password" 
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
            </div>

            <div>
              <Field 
                type="password" 
                id="confirmPassword" 
                placeholder="Powtórz hasło"
                name="confirmPassword" 
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required 
              />
              <ErrorMessage name="confirmPassword" component="div" style={{ color: 'red' }} />
            </div>

            <button type="submit">Zarejestruj się</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

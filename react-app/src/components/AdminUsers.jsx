import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers() {
    const currentUserId = localStorage.getItem('currentUserId');
    const user = JSON.parse(localStorage.getItem(`user_${currentUserId}`));
    console.log(user);//debug
    const userEmail = user.email;
    console.log(userEmail);//debug
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [loading, setLoading] = useState("Ładowanie danych...");
    const [users, setUsers] = useState([]);

    const fetchAdmins = async () => {
        try {
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
        }
      };

    useEffect(() => {
        const initialize = async () => {
            await fetchAdmins();
            if (currentUserId) {
                setLoading("");
            }
        }
        initialize();
    }, []); 

    const fetchUsers = async () => {
        try {
            setLoading("Ładowanie danych...")
            const response = await fetch('http://localhost:3000/api/users');
            if (!response.ok) {
                throw new Error('Nie udało się pobrać użytkowników');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.log('Błąd podczas pobierania użytkowników:', error);
        } finally {
            setLoading("");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteClick = async (email) => {
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć użytkownika');
            }

            setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
            console.log('Użytkownik został usunięty');
        } catch (error) {
            console.log('Błąd podczas usuwania użytkownika:', error);
        }
    };


    return ( 
        <>
            <div>{loading}</div>
            {isUserAdmin === false && <div>Dostęp tylko dla administratorów</div>}
            {isUserAdmin === true && (
                <div className='user-list'>
                    <h2>Lista użytkowników:</h2>
                    {users.map((user, index) => (
                        <div key={index}>
                            <b> Imię: </b> {user.firstName}
                            <b> Nazwisko: </b> {user.lastName}
                            <b> Email: </b> {user.email}
                            <b> ID: </b> {user.id}
                            <button onClick={() => handleDeleteClick(user.email)}>Usuń użytkownika</button>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
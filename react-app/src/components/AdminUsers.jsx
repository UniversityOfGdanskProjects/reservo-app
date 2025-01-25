import React, { useEffect, useReducer } from 'react';
import './styles/AdminUsers.css'

const adminReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, users: action.payload, loading: '' };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_IS_USER_ADMIN':
            return { ...state, isUserAdmin: action.payload };
        case 'DELETE_USER':
            return { ...state, users: state.users.filter(user => user.email !== action.payload) };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: '' };
        default:
            return state;
    }
};


export default function AdminUsers() {
    const currentUserId = localStorage.getItem('currentUserId');
    const user = JSON.parse(localStorage.getItem(`user_${currentUserId}`));
    const userEmail = user?.email || '';

    const initialState = {
        users: [],
        isUserAdmin: false,
        loading: 'Ładowanie danych...',
        error: null,
    };

    const [state, dispatch] = useReducer(adminReducer, initialState);

    const fetchAdmins = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/admins');
            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych adminów');
            }
            const data = await response.json();
            const isAdmin = data.includes(userEmail);
            dispatch({ type: 'SET_IS_USER_ADMIN', payload: isAdmin });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Błąd podczas pobierania danych adminów' });
            console.log('Błąd podczas pobierania danych adminów:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: 'Ładowanie danych...' });
            const response = await fetch('http://localhost:3000/api/users');
            if (!response.ok) {
                throw new Error('Nie udało się pobrać użytkowników');
            }
            const data = await response.json();
            dispatch({ type: 'SET_USERS', payload: data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Błąd podczas pobierania użytkowników' });
            console.log('Błąd podczas pobierania użytkowników:', error);
        }
    };

    const handleDeleteClick = async (email) => {
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć użytkownika');
            }

            dispatch({ type: 'DELETE_USER', payload: email });
            console.log('Użytkownik został usunięty');
        } catch (error) {
            console.log('Błąd podczas usuwania użytkownika:', error);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchAdmins();
            await fetchUsers();
        };
        initialize();
    }, []);

    return (
        <>
            <div>{state.loading}</div>
            {state.error && <div className="error">{state.error}</div>}
            {!state.isUserAdmin && <div>Dostęp tylko dla administratorów</div>}
            {state.isUserAdmin && (
                <div className='user-list'>
                    <h2>Lista użytkowników:</h2>
                    {state.users.map((user, index) => (
                        <div key={index}>
                            <b> Imię:</b>{user.firstName} 
                            <b> Nazwisko:</b>{user.lastName}
                            <b> Email:</b>{user.email}
                            <b> ID:</b>{user.id}
                            <button onClick={() => handleDeleteClick(user.email)}>Usuń użytkownika</button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

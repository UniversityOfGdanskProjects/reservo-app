import React, { useLayoutEffect } from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Rating.css';

export default function Rating() {
    useLayoutEffect(() => {
        const currentUserId = localStorage.getItem('currentUserId');
        const user = JSON.parse(localStorage.getItem(`user_${currentUserId}`)) || {};
        console.log(user); //debugs
        setName(user.firstName || "");
        setSurname(user.lastName || "");
    });

    useEffect(() => {
        fetchOpinions();
    }, []);

    const [text, setText] = useState("");
    const [stars, setStars] = useState(0);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [name, setName] = useState(null);
    const [surname, setSurname] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [opinions, setOpinions] = useState([]);
    const inputRef = useRef(null);

    const fetchOpinions = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/opinions")
            if (!response.ok) {
                throw new Error("Nie udało się pobrać danych")
            }
            const data = await response.json();
            console.log("Pobrane opinie:", data); //debug
            setOpinions(data);
        } catch (error) {
            console.log("Błąd podczas pobierania opinii:", error);
        }
    }

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };
    
    const handleStarClick = (value) => {
    setStars(value);
    };

    const StarRating = ({ rating }) => {
    const stars = useMemo(() => {
        const fullStars = '★'.repeat(rating);
        const emptyStars = '☆'.repeat(5 - rating);
        return fullStars + emptyStars;
    }, [rating]);
    
    return <span>{stars}</span>;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (stars === 0 || text.trim() === "") {
          setError("Proszę wypełnić wszystkie pola i wybrać ocenę.");
          return;
        }
    
        try {
            setError(null);
            const anonymous = !(name && surname); 

            const response = await fetch('http://localhost:3000/api/opinions', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                    content: text,
                    ...(anonymous ? {} : { name, surname }),
                    stars: stars,
                    isAnonymous: anonymous,
                    }),
                });
            
            if (response.status === 201) {
                setSuccessMessage("Dziękujemy za opinię!");
                setText("");
                setStars(0);
                fetchOpinions();
            }
        } catch (err) {
          setError("Wystąpił błąd podczas wysyłania opinii. Spróbuj ponownie.");
        }
      };

    return (
        <div className='opinions'>
           <div className="opinion-form">
                <h2>Dodaj swoją opinię</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        ref={inputRef}
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Napisz swoją opinię..."
                        rows="5"
                        required
                    />
                    <div className="stars">
                    <span>Ocena:</span>
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            type="button"
                            key={value}
                            className={`star ${value <= stars ? "selected" : ""}`}
                            onClick={() => handleStarClick(value)}
                            >
                            ★
                        </button>
                    ))}
                    </div>
                    {error && <p className="error">{error}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                    <button type="submit">Wyślij</button>
                </form>
            </div>
            <ul>
                {opinions.map((opinion, index) => (
                    <li key={index}>
                        <div>
                            {opinion.content}
                            <StarRating rating={opinion.stars} />
                            <div className='name'>{opinion.name} {opinion.surname}</div>
                        </div>

                    </li>
                ))}
            </ul>
        </div>

    )
}
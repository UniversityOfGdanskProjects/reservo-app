import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Payment() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("cancelled")
    const [selectedOption, setSelectedOption] = useState(""); 
    const [deposit, setDeposit] = useState(0);
    const options = ['karta kredytowa', 'blik', 'Apple Pay', 'przelew bankowy']
    useEffect(() => {
        const storedDeposit = localStorage.getItem('deposit');
        const deposit = JSON.parse(storedDeposit);
        console.log(deposit);//debug
        setDeposit(deposit);
    }, []);

    const handleChange = (event) => {
        setStatus("pending");
        setSelectedOption(event.target.value);
    };

    const handleConfirm = () => {
        if (status !== "pending") {
            setStatus("error");
        } else {
            setStatus("confirmed");
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        }
    };

    return (
        <div className='payment'>
            <div>Kwota: {deposit},00 zł</div>
            
            <div>
                <h2>Wybierz jedną opcję</h2>
                <form>
                    {options.map((option, index) => (
                    <div key={index}>
                        <label>
                        <input
                            type="radio"
                            name="options"
                            value={option}
                            checked={selectedOption === option} 
                            onChange={handleChange}
                        />
                        {option}
                        </label>
                    </div>
                    ))}
                </form>
                <div>
                    <p>Wybrana opcja: {selectedOption}</p>
                </div>
                <button onClick={handleConfirm}>Potwierdź i zapłać</button>
                {status === "confirmed" && 
                <>
                <div>Rezerwacja potwierdzona. Dziękujemy za wpłatę!</div>
                <div>Przekierowywujemy na stronę główną...</div>
                </>
                }
                {status === "error" && <div>Proszę wybrać jedną z opcji płatności</div>}
            </div>
        </div>
    )
}
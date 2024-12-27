import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Payment() {
    useEffect(() => {
        const storedDeposit = localStorage.getItem('deposit');
        const deposit = JSON.parse(storedDeposit);
        console.log(deposit);
    }, []);

    return (
        <div className='payment'>
            <div>Kwota: {deposit}</div>
            <input>Podaj dane karty</input>
            
        </div>
    )
}
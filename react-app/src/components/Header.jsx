import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate(); 
  
    const handleOpinionClick = () => {
      navigate('/rate-us');
    };
  
    return (
      <header>
        <div>reservo - menager rezerwacji w trójmieście</div>
        <button className="opinion" onClick={handleOpinionClick}>
          Oceń nas!
        </button>
      </header>
    );
  }
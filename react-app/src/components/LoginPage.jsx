import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Stack,
  Alert,
} from '@mui/material';

export default function LoginPage() {
  const { setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(false);

  const handleRegistryClick = () => {
    navigate('/registry');
  };

  const handleLoginClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        console.log(data); // debug
        localStorage.setItem(`user_${data.id}`, JSON.stringify(data));
        localStorage.setItem('currentUserId', data.id);
        setLoggedIn(true);
        navigate('/home');
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Błąd podczas logowania:', err);
      setError(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{
        mt: 8,
        p: 10, 
        textAlign: 'center',
        boxShadow: 6, 
        borderRadius: 2, 
        backgroundColor: "#323232", 
      }}>
        <Typography variant="h4" gutterBottom>
          Zaloguj się
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Email i hasło nie są prawidłowe
          </Alert>
        )}
        <Stack spacing={2}>
          <TextField
            label="Adres email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              input: {
                color: '#ffffff', 
              },
              label: {
                color: '#ffffff', 
              },
            }}
          />
          <TextField
            label="Hasło"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              input: {
                color: '#ffffff', 
              },
              label: {
                color: '#ffffff', 
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleLoginClick}
            fullWidth
            sx={{
              backgroundColor: "#646cffaa", 
              "&:hover": {
                backgroundColor: "#5359c6aa", 
              },
            }}
          >
            Zaloguj się
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRegistryClick}
            fullWidth
          >
            Utwórz konto
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

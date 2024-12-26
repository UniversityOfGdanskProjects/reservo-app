import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const users = [];

app.post('/api/register', async (req, res) => {
    console.log('Dane odebrane na backendzie:', req.body);
    const { email, password, firstName, lastName } = req.body;

    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).send('Użytkownik o takim emailu już istnieje.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        email,
        password: hashedPassword,
        firstName: firstName,  
        lastName: lastName,    
    };
    
    users.push(newUser);
    console.log('Nowy użytkownik:', newUser)
    res.status(201).send('Zarejestrowano pomyślnie');
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    const user = users.find(user => user.email === email);
    console.log('Znaleziony użytkownik:', user);
    if (!user) {
      return res.status(404).send('Nie znaleziono użytkownika');
    }
  
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send('Nieprawidłowe hasło');
    }
  
    res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  });

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});

import express from 'express';
import bcrypt from 'bcrypt';
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
        id: users.length + 1,
        email,
        password: hashedPassword,
        firstName: firstName,  
        lastName: lastName,    
    };
    
    users.push(newUser);
    console.log('Nowy użytkownik:', newUser)
    res.status(201).send('Zarejestrowano pomyślnie');
});

app.get('/api/users', (req, res) => {
  console.log(users);
  console.log('Żądanie do /api/users');
  if (users.length === 0) {
      return res.status(404).send('Brak użytkowników');
  }

  const usersInfo = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
  }));

  res.status(200).json(usersInfo);
});

app.delete('/api/users', (req, res) => {
  const { email } = req.body;

  const userIndex = users.findIndex(user => user.email === email);
  if (userIndex === -1) {
    return res.status(404).send('Użytkownik nie został znaleziony');
  }

  users.splice(userIndex, 1);
  console.log(`Usunięto użytkownika: ${email}`);
  
  res.status(200).send('Użytkownik został usunięty');
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
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  });

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});

const reservations = []; 

app.post('/api/reservations', (req, res) => {
    const { restaurant, date, time, userId } = req.body;
    
    if (!date || !time || !restaurant || !userId) {
        return res.status(400).send('Data, godzina i restauracja są wymagane.');
    }

    const isTaken = reservations.some(
        (reservation) => reservation.date === date && reservation.time === time && reservation.restaurant === restaurant
    );

    if (isTaken) {
        return res.status(409).send('Termin jest już zajęty.');
    }

    reservations.push({ restaurant, date, time, userId});
    console.log('Rezerwacje:', reservations);
    res.status(201).send('Rezerwacja została zapisana.');
});

app.get('/api/reservations', (req, res) => {
    res.status(200).json(reservations);
});

app.delete('/api/reservations', (req, res) => {
  const { id, date, time } = req.body;
  console.log('Dane otrzymane w żądaniu DELETE:', { id, date, time });
  console.log('Obecne rezerwacje na backendzie:', reservations);

  if (!date || !time) {
      return res.status(400).send('Data i godzina są wymagane do usunięcia rezerwacji.');
  }

  const index = reservations.findIndex(
      (reservation) => reservation.date === date && reservation.time === time && reservation.restaurant.id === id
  );

  if (index === -1) {
      return res.status(404).send('Rezerwacja nie została znaleziona.');
  }

  reservations.splice(index, 1);
  console.log('Zaktualizowane rezerwacje:', reservations);//debug
  res.status(200).send('Rezerwacja została anulowana.');
});

const restaurants = [
  {name: "Restauracja Diuna", city: "Sopot", adress: "Aleja Franciszka Mamuszki 22", deposit: 10},
  {name: "Śliwka w Kompot", city: "Sopot", adress: "Bohaterów Monte Cassino 42", deposit: 15},
  {name: "Monte Verdi Ristorante Pizzeria", city: "Gdynia", adress: "Józefa Wybickiego 3", deposit: 30},
  {name:"Kucharia", city:"Gdańsk", adress: "Antoniego Słonimskiego 6", deposit: 10},
  {name:"Pueblo", city:"Gdańsk", adress: "Kołodziejska 4", deposit: 15},
  {name:"Pueblo", city:"Gdynia", adress: "Antoniego Abrahama 56", deposit: 12},
  {name:"Prosty Temat Sopot", city:"Sopot", adress: "Bohaterów Monte Cassino 60", deposit: 40},
  {name:"Tapas de Rucola", city:"Sopot", adress: "Generała Kazimierza Pułaskiego 15", deposit: 20},
  {name:"Bistro Oliwa", city:"Gdańsk", adress: "", deposit: 15},
  {name:"Hashi Sushi", city:"Gdańsk", adress: "", deposit: 20},
  {name:"Hashi Sushi", city:"Gdynia", adress: "", deposit: 17},
  {name:"Pierogarnia Mandu", city:"Gdańsk", adress: "", deposit: 15}, 
  {name:"Pierogarnia Mandu", city:"Gdynia", adress: "", deposit: 15},
  {name:"Kebab DRWAL", city:"Gdańsk", adress: "", deposit: 5},
  {name:"Lolo Thai Jolo", city:"Gdynia", adress: "", deposit: 8},
  {name:"Pyra Bar Gdynia", city:"Gdynia", adress: "", deposit: 5},
  {name:"HAOS", city:"Gdynia", adress: "Starowiejska 14", deposit: 12}
];

const restaurantsWithId = restaurants.map((element, index) => {
  const { name, city, adress, deposit } = element;
  return { id: index + 1, name, city, adress, deposit };
})

app.get('/api/restaurants', (req, res) => {
  res.status(200).json(restaurantsWithId);
});

app.delete('/api/restaurants', (req, res) => {
  const { id } = req.body;

  const restaurantIndex = restaurantsWithId.findIndex(restaurant => restaurant.id === id);
  if (restaurantIndex === -1) {
    return res.status(404).send('Restauracja nie została znaleziona');
  }

  restaurantsWithId.splice(restaurantIndex, 1);
  console.log(`Usunięto restaurację}`);
  
  res.status(200).send('Restauracja została usunięta');
});

app.post('/api/restaurants', (req, res) => {
  const { name, city, adress, deposit } = req.body;

  if (!name || !city || !adress || !deposit) {
    return res.status(400).send('Wszystkie dane restauracji muszą być przekazane!');
  }

  const newRestaurant = {
    id: restaurantsWithId.length + 1,
    name,
    city,
    adress,
    deposit,
  };

  restaurantsWithId.push(newRestaurant);
  console.log('Nowa restauracja:', newRestaurant);

  res.status(201).send('Restauracja została dodana');
});


const admins = ["kanabaj.amelia@gmail.com"];

app.get('/api/admins', (req, res) => {
  res.status(200).json(admins);
});
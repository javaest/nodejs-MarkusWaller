const basicAuth = require('basic-auth');

const auth = function (req, res, next) {
  const user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send('Authentication required.');
  }

  if (user.name === 'admin' && user.pass === 'password') {
    return next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send('Authentication required.');
  }
}

const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];


// Default-Route
app.get('/', auth, (req, res) => {
  res.send('Willkommen auf der API! Ergänzen Sie die URL um "/api/users" für den Endpunkt.');
});

app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1, 
    name: req.body.name,
    // ... weitere User-Daten ... 
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// Beispielroute
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

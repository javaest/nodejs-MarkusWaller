const basicAuth = require('basic-auth');
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Middleware für die Authentifizierung
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

// Middleware zum Parsen von JSON-Daten im Request-Body
app.use(express.json());

// Default-Route (geschützt mit Authentifizierung)
app.get('/', auth, (req, res) => {
  res.send('Willkommen auf der API! Ergänzen Sie die URL um "/api/users" für den Endpunkt.');
});

// POST-Route zum Hinzufügen eines neuen Benutzers (geschützt mit Authentifizierung)
app.post('/api/users', auth, (req, res) => {
  const { name } = req.body;

  // Überprüfen, ob der Name vorhanden ist
  if (!name) {
    return res.status(400).json({ error: 'Name ist erforderlich.' });
  }

  // Neuen Benutzer mit neuer ID erstellen
  const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  const newUser = { id: newId, name };
  users.push(newUser);

  // Erfolgreiche Rückmeldung
  res.status(201).json(newUser);
});

// GET-Route zum Abrufen aller Benutzer
app.get('/api/users', auth, (req, res) => {
  res.json(users);
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
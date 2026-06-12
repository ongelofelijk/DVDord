//Werkt nog nie, js kut.
// werkt soort van js is nie kut
// hoe maak je een chat database????????????????????????!!!!!!!!!!!!!!!!!!!!

const express = require("express");
const fs = require("fs");
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require("cors");
require('dotenv').config();
const app = express();
app.use(express.json());
const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'https://evilborb.github.io'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
const adminPassword =process.env.ADMIN_PASSWORD|| 'test';
app.use(express.urlencoded({ extended: true }));
const mysql = require('mysql2/promise');
// aaa yes

app.use(session({
  name: 'session_id',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  }
}));

let dataBase;


(async () => {
  dataBase = await mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.MY_SQL_PASSWORD,
    database: process.env.DB_NAME || 'your_db',
    waitForConnections: true,
    connectionLimit: 10
  });

  // Maak de gebruikerstabel aan
  await dataBase.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255),
      username VARCHAR(255),
      password VARCHAR(255)
    )
  `);

  // HIER IS DE CHATDATABASE/TABEL TOEGEVOEGD
  await dataBase.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database + tables ready');
})();

function getUsers() {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE));
}

function saveUsers(users) {
    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

async function usernameExists(username) {
    const [rows] = await dataBase.execute(
    'SELECT id FROM users WHERE username = ?',
    [username]
    );
    return rows.length > 0;
}
function requireLogin(req, res, next) {
  console.log('try')
  if (req.session.user) {
    console.log(req.session.user)
    
    return next();}
  console.log("not logged in")
  res.redirect('/login');
  
}



app.post('/api/login', async (req, res) => {
  console.log('ehho')
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('missing')
    return res.status(400).send('Missing fields');
  }

  const [rows] = await dataBase.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  if (rows.length === 0) {
    console.log('invallid user')
    return res.status(401).send('Invalid credentials');
  }

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    console.log('invalid pass')
    return res.status(401).send('Invalid credentials');
  }
  console.log('succes')
  req.session.user = {
    id: user.id,
    username: user.username
  };
res.redirect('/me');});



app.post('/api/sign-up', async (req, res)=> {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).send('Missing fields');
    }

    if (await usernameExists(username)) {
      return res.status(400).send('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dataBase.execute(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    );

    res.send('User created');
})

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.clearCookie('session_id', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.send('ok');
  });
});
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => console.log(`Server listening on http://${HOST}:${PORT} (serving files from public)`));
app.get('/', (req, res) => {
  res.redirect('/home/');
});
app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ error: 'not logged in' });
  }

  res.json({
    id: req.session.user.id,
    username: req.session.user.username
  });
})
app.use('/me', requireLogin);
app.use(express.static("public"));
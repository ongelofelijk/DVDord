let http = require('http');

//Werkt nog nie, js kut.

const express = require("express");
const fs = require("fs");
const session = require('express-session');

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const adminPassword =process.env.ADMIN_PASSWORD|| 'test';
const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
const mysql = require('mysql2/promise');

let dataBase;
(async () => {
  dataBase = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'your_db'
  });
})();

app.use(express.static("public"));
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!');
}).listen(8080); 
console.log('Server running at http://localhost:8080/');

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

app.POST('/api/sign-up', async (req, res)=> {
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
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => console.log(`Server listening on http://${HOST}:${PORT} (serving files from ${__dirname})`));
app.use(express.static(__dirname));

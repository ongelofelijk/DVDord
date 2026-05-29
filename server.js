let http = require('http');

//Werkt nog nie, js kut.

const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
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

function print(message){
    console.log(message);
}
function submitForm() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;

    // Perform form validation (e.g., check if fields are not empty)
    if (username === "" || password === "" || email === "") {
        alert("Please fill in all fields.");
        return;
    }
    try{
        let accounts = getUsers();
        if (username in accounts) {
            alert(`Username ${username} is already taken.`);
            return;
        }
        accounts[username] = {
        "password": password,
        "email": email
        };
        saveUsers(accounts);
        //window.location.href = "Sign-up.html";
    }
    catch(error){
        alert("Error fetching accounts data: " + error);
        return;
    }
    
}
app.post('/api/sign-up', async (req, res)=> {
    let body = req.body 
    print(body.text)
    res.json({  
    status: 'success',   
  }); 
})

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => console.log(`Server listening on http://${HOST}:${PORT} (serving files from ${__dirname})`));
app.use(express.static(__dirname));

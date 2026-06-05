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

function print(message){
    console.log(message);
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

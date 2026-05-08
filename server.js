let http = require('http');
const express = require('express');
const app = express();
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!');
}).listen(8080); 
console.log('hello world')
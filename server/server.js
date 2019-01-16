const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const { Client } = require('pg')

const clientpg = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '88228228',
})

let wsUrl = '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
let origin = [];

app.get('/', function (req, res, next) {
  origin.push("192.168.0.103:8080")
  origin.push(req.headers.host);
  console.log(origin)
  res.end();
});

app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', "*")
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
});

app.use(function (req, res, next) {
  wsUrl = req.url;
  req.testing = 'testing';
  return next();
});
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('change', data => { /* … */
    io.emit('change', data.value);
  });
  client.on('disconnect', () => { /* … */
  });
  client.on('newMessage', data => {

  });
  client.on('chatOpened', ()=>{
    console.log('opened')
    clientpg.query('SELECT * from chat_history')
      .then(res => console.log(res.rows[0]))
      .catch(e => console.error(e.stack))
  })
});
server.listen(8000);

process.stdin.on('data', function (data) {
  io.emit('change', data.toString());
})

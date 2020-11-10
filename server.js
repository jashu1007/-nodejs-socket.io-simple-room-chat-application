const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const expressEJS = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const io = socketIo(server);
const moment = require('moment');
const { userJoin, userLeave, getUsers } = require('./utils/users');
//middleware for client area
app.use(expressEJS);

//setting view engine
app.set('view engine', 'ejs');

//join static path
app.use(express.static(__dirname + '/public'));

//middelware for json
app.use(bodyParser.json());

//global variables
app.use((req, res, next) => {
  next();
});

//errors
let errors = [];

//creating routes
app.get('/', (req, res) => {
  res.render('index', {
    errors,
  });
});
let username, userRoom;
//getting room details
app.get('/chat', (req, res, next) => {
  const { name, room } = req.query;

  errors = [];

  if (!name) {
    errors.push({ msg: 'Please enter your name' });
    res.redirect('/');
  } else {
    username = name;
    userRoom = room;
    res.render('chat', {
      name,
      room,
    });
  }
});

const botName = 'Chatbot';
const time = moment().format('H:mm a');
io.on('connection', (socket) => {
  socket.on('userJoin', () => {
    const user = userJoin(socket.id, username, userRoom);
    const roomUsers = getUsers(user.room);
    socket.join(user.room);
    socket.emit('message', {
      user: botName,
      message: 'Welcome to ChatRoom',
      time: time,
    });
    socket.broadcast.to(user.room).emit('message', {
      user: botName,
      message: `${user.username} has joined`,
      time: time,
    });

    io.to(user.room).emit('users', roomUsers);
  });
  socket.on('chatMessage', (chatMessage) => {
    const message = chatMessage;

    io.to(userRoom).emit('message', {
      user: username,
      message: message,
      time: time,
    });
  });
  socket.on('disconnect', () => {
    const userLeaves = userLeave(socket.id);
    const roomUsers = getUsers(userRoom);

    if (userLeaves) {
      io.to(userLeaves.room).emit('message', {
        user: botName,
        message: `${userLeaves.username} left the chat`,
        time: time,
      });
      io.to(userLeaves.room).emit('users', roomUsers);
      // // Send users and room info
      // io.to(user.room).emit('roomUsers', {
      //   room: user.room,
      //   users: getRoomUsers(user.room),
      // });
    }
  });
});

//port
const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`server is running on port ${port}`));

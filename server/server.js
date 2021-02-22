var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var port = process.env.PORT || 5000
var connection = require('./database/db')

const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', socket => {
  socket.on('join', function (data) {
    const messages = [];
    connection.query('SELECT * FROM messages WHERE (username = ? || sender = ?)', [data.username, data.username], function (err, rows, results) {
      if (err) {
        socket.emit('error', err.code)
      } else {
        for (k in rows) {
          var row = rows[k]
          if (row.username === data.to || row.sender === data.to) {
            if (row.username === data.to) {
              let message = {
                message: row.message,
                me: data.username,
                to: data.to
              }
              messages.push(message)
            }
            else {
              let message = {
                message: row.message,
                me: data.to,
                to: data.username
              }
              messages.push(message)
            }
          }
        }
        io.sockets.emit("messages", messages)
      }
    })
  });

  socket.on('newmsg', function (message, user) {
    if (message === '') {
      socket.emit('error', 'Vous ne pouvez pas envoyer un message vide')
    } else {
      const today = new Date()
      let date = today.getDate() + "-" + parseInt(today.getMonth() + 01) + "-" + today.getFullYear();
      connection.query('INSERT INTO messages SET username = ?, sender = ?, message = ?, date = ?', [
        user.to,
        user.username,
        message,
        today,
      ], function (err) {
        if (err) {
          socket.emit('error', err.code)
        }
        else {
          let newMessage = {
            message: message,
            me: user.username,
            to: user.to
          }
          let tmp = { liked: user.to }
          io.sockets.emit('newNotif', tmp)
          connection.query('INSERT INTO notif SET username = ?, sender = ?, notification = "nouveau message", readed = 0, date = ?', [newMessage.to, newMessage.me, today], (err, result) => {
            if (err) console.log(err)
            io.sockets.emit('receiveMessage', newMessage)
          })
        }
      })
    }
  });

  socket.on('unLikeNotif', function (user) {
    const today = new Date()
    let date = today.getDate() + "-" + parseInt(today.getMonth() + 01) + "-" + today.getFullYear();
    const userData = {
      username: user.username,
      unliked: user.liked,
      scorePop: user.scorePop,
      error: user.error,
    }
    connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.unliked, userData.username], (err, rows, result) => {
      if (err) console.log(err)
      if (rows !== [] && rows !== undefined && rows.length > 0) {
        connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [user.liked, user.username], (err, rows, result) => {
          if (rows.length === 0) {
            connection.query('INSERT INTO notif SET username = ?, sender = ?, notification = "Cet utilisateur ne vous like plus", readed = 0, date = ?', [userData.unliked, userData.username, today], (err, result) => {
              if (err) console.log(err)
            })
          }
        })
      }
    })
    connection.query('DELETE FROM likes WHERE username = ? AND liked = ?', [userData.username, userData.unliked], (err, result) => {
      if (err) console.log(err)
      let tmp = userData.scorePop - 30;
      connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [user.liked, user.username], (err, rows, result) => {
        if (rows.length === 0) {
          connection.query('UPDATE users SET scorePop = ? WHERE username = ?', [tmp, userData.unliked], (err, results) => {
            if (err) console.log(err)
            io.sockets.emit('unLikeNotif', user)
            io.sockets.emit('newNotif', user)
          });
        }
      });
    })
  })

  socket.on('likeNotif', function (user) {
    const today = new Date()
    let date = today.getDate() + "-" + parseInt(today.getMonth() + 01) + "-" + today.getFullYear();

    let userData = user
    connection.query('INSERT INTO likes SET username = ?, liked = ?', [userData.username, userData.liked], (err, result) => {
      if (err) console.log(err)
      if (!err) {
        connection.query('SELECT * FROM likes WHERE username = ? AND liked = ?', [userData.liked, userData.username], (err, rows, result) => {
          if (rows !== [] && rows !== undefined && rows.length > 0) {
            connection.query('INSERT INTO notif SET username = ?, sender = ?, notification = "Cet utilisateur vous like aussi !", readed = 0, date = ?', [userData.liked, userData.username, today], (err, result) => {
              let tmp = userData.scorePop + 30;
              connection.query('UPDATE users SET scorePop = ? WHERE username = ?', [tmp, userData.liked], (err, results) => {
                if (err) console.log(err)
                io.sockets.emit('likeNotif', user)
                io.sockets.emit('newNotif', user)
              });
            });
          }
          else {
            connection.query('INSERT INTO notif SET username = ?, sender = ?, notification = "liker", readed = 0, date = ?', [userData.liked, userData.username, today], (err, result) => {
              let tmp = userData.scorePop + 30;
              connection.query('UPDATE users SET scorePop = ? WHERE username = ?', [tmp, userData.liked], (err, results) => {
                if (err) console.log(err)
                io.sockets.emit('likeNotif', user)
                io.sockets.emit('newNotif', user)
              });

            })
          }
        });
      }
    })
  })

  socket.on('visitNotif', function (user) {
    const today = new Date()
    if (user.liked !== user.username) {
      connection.query('SELECT * FROM block WHERE username = ? AND blocked = ?', [user.liked, user.username], (err, rows, result) => {
        if (rows.length === 0) {
          connection.query('SELECT * FROM notif WHERE username = ? AND sender = ?', [user.liked, user.username], (err, rows, result) => {
            if (err) console.log(err)
            if (rows.length > 0) {
              connection.query('UPDATE notif SET date = ?, readed = 0 WHERE username = ? AND sender = ? AND notification = "visiter"', [today, user.liked, user.username], (err, result) => {
                if (err) console.log(err)
                io.sockets.emit('newNotif', user)
              })
            }
            else {
              connection.query('INSERT INTO notif SET username = ?, sender = ?, notification = "visiter", readed = 0, date = ?', [user.liked, user.username, today], (err, result) => {
                // GERER POINTS DES VISITS SCORE POP
                let tmp = user.scorePop + 10;
                connection.query('UPDATE users SET scorePop = ? WHERE username = ?', [tmp, user.liked], (err, results) => {
                  if (err) console.log(err)
                  io.sockets.emit('newNotif', user)
                });
              })
            }
          })
        }
      })
    }
  });

  socket.on('likeNotif', function (user) {
    io.sockets.emit('newNotif', user)
  });
});

app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true
}));

app.use(cors())

var Users = require('./routes/Users')

app.use('/users', Users)
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
});
server.listen(port)

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const WebSocket = require('ws');

    app.set('view engine', 'ejs')
    app.use(methodOverride('_method'))
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

let player1

const sessions = [1]
let moves = []

    app.get('/',(req, res) => {
            res.render('main.ejs')
      });

      const wss = new WebSocket.Server({ port: 8081 });

      wss.on('connection', function connection(ws) {

        ws.on('message', function incoming(message) {
          let messageToString = String(message);
          let newMessage = messageToString.charAt(messageToString.length-1); //Last character of the message
          let newMessageFirstCharacter = messageToString.substring(0, messageToString.length-1) //First character of the message
          let newMessageFirstCharacterRemoved = messageToString.slice(1) // First character removed from message
          let newMessageLastCharacterRemoved = newMessageFirstCharacterRemoved.slice(0, -1) // First and last character removed from message
          console.log(newMessageLastCharacterRemoved)
          if (message == "Waiting") {
            if (player1 == undefined) {
              sessions.push(1)
            ws.send(sessions.length + "1")
            player1 = 1;
            }
            else {
              ws.send(sessions.length + "2")
              player1 = undefined
            }
          } 
          else if (newMessage == "L") { //Updates array with players new move
            moves.push(newMessage)
          }
          else if (newMessageFirstCharacter == "R") { //Sends playerx any new moves done by playery
            moves.find
            ws.send()
          }
        });
      });

    app.listen(80, function() {
        console.log('Listening on port 80!')
      })
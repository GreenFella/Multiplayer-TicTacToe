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
          let newMessageLastCharacter = messageToString.charAt(messageToString.length-1); //Last character of the message
          let newMessageFirstCharacter = messageToString.slice(0, 1) //First character of the message
          let newMessageFirstCharacterRemoved = messageToString.slice(1) // First character removed from message
          let newMessageLastCharacterRemoved = messageToString.slice(0, -1) // Last character removed from message
          let newMessageFirstAndLastCharacterRemoved = newMessageFirstCharacterRemoved.slice(0, -1) // First and last character removed from message
          let newMessageLastThreeCharacterRemoved = messageToString.slice(0, -3) // Last three characters removed from message
          console.log(messageToString)
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
          else if (newMessageLastCharacter == "L") { //Updates array with players new move
            moves.push(newMessageLastCharacterRemoved)
            console.log(newMessageLastCharacterRemoved)
            console.log(moves)
          }
          else if (newMessageFirstCharacter == "R") { //Sends playerx any new moves done by playery. client set to request update every 250ms
            let checkPlayerNumber = reverseNumber()
            function reverseNumber () {
              var oppositePlayer
              if (newMessageLastCharacter == "1") {
                var oppositePlayer = "2"
              }
              else if (newMessageLastCharacter == "2") {
                var oppositePlayer = "1"
              }
              return oppositePlayer
            }
            let checkMoves = moves.find(newSessionMoves)
            console.log(moves + " FIRSTCHECK " + checkPlayerNumber)
            function newSessionMoves(moveCheck) {
              return moveCheck == (newMessageFirstAndLastCharacterRemoved + checkPlayerNumber + ("1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9") )
            }
            console.log(checkMoves + " Move!!!!!!!!!!!!")
            let playerLocationStringify = String(checkMoves)
            let playerLocationSliced = playerLocationStringify.charAt(playerLocationStringify.length-1)
            ws.send(playerLocationSliced)
          }
        });
      });

    app.listen(80, function() {
        console.log('Listening on port 80!')
      })
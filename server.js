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
          let mesToJson = JSON.parse(message)
          if (mesToJson.type == "waiting") {
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
          else if (mesToJson.type == "updateLocation") { //Updates array with players new move
            moves.push(mesToJson)
          }
          else if (mesToJson.type == "getUpdate") { //Sends playerx any new moves done by playery. client set to request update every 250ms
            let checkPlayerNumber = reverseNumber()
            function reverseNumber () {
              var oppositePlayer
              if (mesToJson.player == "1") {
                var oppositePlayer = 2
              }
              else if (mesToJson.player == "2") {
                var oppositePlayer = 1
              }
              return oppositePlayer
            }
            let checkMoves = moves.find(item => item.sessionId == mesToJson.sessionId && item.player == checkPlayerNumber)
            //let toObject = Object.fromEntries(checkMoves)
            console.log(checkMoves)
            console.log(checkMoves.locationNumber)
            //ws.send(checkMoves)
          }
        });
      });

    app.listen(80, function() {
        console.log('Listening on port 80!')
      })
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
const sessions = []
const sessionsPlayerCount = []
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
            let sendPlayerInfoWS = ({messageType: "sendPlayerInfo", sessionIdServer: sessions.length, playerNum: "1"})
            ws.send(JSON.stringify(sendPlayerInfoWS))
            player1 = 1;
            }
            else if (player1 = 1) {
              let sendPlayerInfoWS = ({messageType: "sendPlayerInfo", sessionIdServer: sessions.length, playerNum: "2"})
            ws.send(JSON.stringify(sendPlayerInfoWS))
              player1 = undefined
              sessionsPlayerCount.push(sessions.length)
            }
          } 
          else if (mesToJson.type == "getPlayerUpdate") { //Client asking if they have someone to play against yet
            let sessionsPlayerCountFind = sessionsPlayerCount.find(item => item == mesToJson.sessionId)
            if (sessionsPlayerCountFind !== undefined) {
              let sendFoundPlayerInfoWS = ({messageType: "foundPlayer"})
            ws.send(JSON.stringify(sendFoundPlayerInfoWS))
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
            /* if (checkMoves.locationNumber == undefined) {

            }
            console.log(checkMoves.locationNumber)
            //ws.send(checkMoves) */
          }
        });
      });

    app.listen(80, function() {
        console.log('Listening on port 80!')
      })
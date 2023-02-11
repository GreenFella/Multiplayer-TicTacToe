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

    app.get('/',(req, res) => {
            res.render('main.ejs')
      });

      const wss = new WebSocket.Server({ port: 8081 });

      wss.on('connection', function connection(ws) {

        ws.on('message', function incoming(message) {
          console.log('received: %s', message);
          
            ws.send('message received');
          
        });
      });

      

    app.listen(80, function() {
        console.log('Listening on port 80!')
      })
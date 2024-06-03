const next = require('next')
const { createServer } = require('http')
const WebSocket = require("ws")
const { parse } = require('url')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res, parse(req.url, true)))
  const wss = new WebSocket.Server({ noServer: true })

  wss.on("connection", async function connection(ws) {
    console.log('incoming connection', ws);
    ws.onclose = () => {
      console.log('connection closed', wss.clients.size);
    };
  });

  server.on('upgrade', function (req, socket, head) {
      const { pathname } = parse(req.url, true);
      if (pathname !== '/_next/webpack-hmr') {
          wss.handleUpgrade(req, socket, head, function done(ws) {
              wss.emit('connection', ws, req);
          });
      }
  });

  server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port} and ws://localhost:${port}`)
  })
})

// app.prepare().then(() => {
//   const server = express()

//   server.all('*', (req, res) => {
//     return handle(req, res)
//   })

//   server.listen(port, (err) => {
//     if (err) throw err
//     console.log(`> Ready on http://localhost:${port}`)
//   })

//   const { WebSocketServer } = require('ws')
//   const sockserver = new WebSocketServer({ port: 3001 })

//   sockserver.on('connection', ws => {
//     console.log('New client connected!')
    
//     ws.on('close', () => console.log('Client has disconnected!'))
    
//     ws.on('message', data => {
//       sockserver.clients.forEach(client => {
//       console.log(`distributing message: ${data}`)
//       client.send(`${data}`)
//       })
//     })
    
//     ws.onerror = function () {
//       console.log('websocket error')
//     }
//   })
// })

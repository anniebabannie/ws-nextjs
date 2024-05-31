const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })

  const { WebSocketServer } = require('ws')
  const sockserver = new WebSocketServer({ port: 3001 })

  sockserver.on('connection', ws => {
    console.log('New client connected!')
    
    ws.on('close', () => console.log('Client has disconnected!'))
    
    ws.on('message', data => {
      sockserver.clients.forEach(client => {
      console.log(`distributing message: ${data}`)
      client.send(`${data}`)
      })
    })
    
    ws.onerror = function () {
      console.log('websocket error')
    }
  })
})

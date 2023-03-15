import {WebSocketServer} from 'ws'
import {fromQueue, pipe, consume} from 'heliograph'

class User {
  #socket
  name = null

  registrations = fromQueue()
  coordinates = fromQueue()

  constructor(socket) {
    this.#socket = socket
    socket.on('message', (data) => {
      const message = JSON.parse(data.toString())
      this.#processMessage(message)
    })
  }

  #processMessage(message) {
    switch (message.action) {
      case 'register': {
        this.name = message.name
        this.registrations.push(message.name)
        break
      }

      case 'mouse': {
        this.coordinates.push(message.coordinates)
        break
      }

      default: {
        console.error('Unknown action')
      }
    }
  }

  notify(message) {
    this.#socket.send(JSON.stringify(message))
  }
}

const users = new Set()

const wss = new WebSocketServer({port: 8081})

wss.on('connection', (ws) => {
  ws.on('error', console.error)
  const currentUser = new User(ws)
  users.add(currentUser)

  pipe(
    currentUser.registrations,
    consume((name) => {
      for (const user of users) {
        if (user !== currentUser) {
          user.notify({
            type: 'register',
            user: name,
          })
        }
      }
    }),
  )
  for (const user of users) {
    if (user !== currentUser) {
      currentUser.notify({
        type: 'register',
        user: user.name,
      })
    }
  }

  pipe(
    currentUser.coordinates,
    consume((coordinates) => {
      for (const user of users) {
        if (user !== currentUser) {
          user.notify({
            type: 'mouse',
            user: currentUser.name,
            coordinates,
          })
        }
      }
    }),
  )
})

import {glob} from 'https://esm.sh/goober'
import {
  fromWebSocket,
  fromClock,
  fromQueue,
  pipe,
  map,
  filter,
  sample,
  fork,
  consume,
} from 'https://esm.sh/heliograph'
import {Renderer} from './renderer.js'
import {Renderable as SignIn} from './sign-in.js'
import {Renderable as Canvas} from './canvas.js'
import {Renderable as Cursor} from './cursor.js'

glob`
  body {
    margin: 0;
    font-family: "Gloria Hallelujah", cursive;
    font-size: 18px;
    line-height: 1.8;
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }
`

const renderer = new Renderer(document.body.firstElementChild)
const signIn = new SignIn(renderer)
const canvas = new Canvas(renderer)
const users = new Map()

const socket = await fromWebSocket('ws://localhost:8081')
const messages = pipe(
  socket,
  map((message) => JSON.parse(message)),
)
const [messages1, messages2] = fork(messages, 2)

pipe(
  messages1,
  filter((message) => message.type === 'mouse' && message.user !== null),
  filter((message) => users.has(message.user)),
  consume((message) => {
    const user = users.get(message.user)
    user.coordinates.push(message.coordinates)
  }),
)

signIn.render()
for await (const name of signIn.submissions) {
  socket.send(JSON.stringify({action: 'register', name}))
  signIn.remove()
  break
}

canvas.render()
pipe(
  canvas.mousePosition,
  sample(fromClock(100)),
  consume((coordinates) =>
    socket.send(JSON.stringify({action: 'mouse', coordinates})),
  ),
)

pipe(
  messages2,
  filter((message) => message.type === 'register' && message.user !== null),
  consume((registration) => {
    const coordinates = fromQueue()
    const cursor = new Cursor(renderer, coordinates)
    cursor.render()
    users.set(registration.user, {
      coordinates,
      cursor,
    })
  }),
)

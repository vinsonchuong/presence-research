import {useState} from 'https://esm.sh/react'
import {html} from 'https://esm.sh/htm/react'
import {css} from 'https://esm.sh/goober'
import {
  WiredCard,
  WiredInput,
  WiredButton,
} from 'https://esm.sh/wired-elements-react'
import {fromQueue} from 'https://esm.sh/heliograph'
import {Renderable as BaseRenderable} from './renderer.js'

const styles = css`
  wired-card {
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    padding: 64px;
  }

  .content {
    display: grid;
    gap: 24px;
  }

  wired-input {
    box-sizing: border-box;
    width: 100%;
  }

  wired-button {
    justify-self: end;
  }
`

function Component({onSubmit}) {
  const [name, setName] = useState('')

  return html`
    <div className=${styles}>
      <${WiredCard} elevation="2">
        <div className="content">
          <${WiredInput}
            placeholder="Name"
            value=${name}
            onChange=${(event) => setName(event.target.value)}
          />
          <${WiredButton}
            disabled=${name.length === 0}
            onClick=${() => onSubmit(name)}
          >
            Sign In
          </${WiredButton}>
        </div>
      </${WiredCard}>
    </div>
  `
}

export class Renderable extends BaseRenderable {
  submissions = fromQueue()

  constructor(renderer) {
    super(renderer, Component, {
      onSubmit: (name) => {
        this.submissions.push(name)
      },
    })
  }
}

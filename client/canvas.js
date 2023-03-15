import {html} from 'https://esm.sh/htm/react'
import {css} from 'https://esm.sh/goober'
import {fromQueue} from 'https://esm.sh/heliograph'
import {WiredCard} from 'https://esm.sh/wired-elements-react'
import {Renderable as BaseRenderable} from './renderer.js'

const styles = css`
  wired-card {
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .content {
    width: 800px;
    height: 800px;
  }
`

function Component({onMouseMove}) {
  return html`
    <div className=${styles}>
      <${WiredCard} elevation="2">
        <div
          className="content"
          onMouseMove=${onMouseMove}
        />
      </${WiredCard}>
    </div>
  `
}

export class Renderable extends BaseRenderable {
  mousePosition = fromQueue()

  constructor(renderer) {
    super(renderer, Component, {
      onMouseMove: (event) => {
        event.clientX
        event.clientY
        const {left, top} = event.target.getBoundingClientRect()
        this.mousePosition.push({
          x: event.clientX - left,
          y: event.clientY - top,
        })
      },
    })
  }
}

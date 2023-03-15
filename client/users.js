import {html} from 'https://esm.sh/htm/react'
import {css} from 'https://esm.sh/goober'
import {pipe, consume} from 'https://esm.sh/heliograph'
import {Renderable as BaseRenderable} from './renderer.js'

const styles = css`
  position: fixed;
  width: 4px;
  height: 4px;
  background: red;
  margin-top: calc(50vh - 400px - 2px);
  margin-left: calc(50vw - 400px - 2px);
`

function Component({coordinates}) {
  if (!coordinates) {
    return null
  }

  return html`
    <div
      className=${styles}
      style=${{
        left: `${coordinates.x}px`,
        top: `${coordinates.y}px`,
      }}
    ></div>
  `
}

export class Renderable extends BaseRenderable {
  constructor(renderer, coordinates) {
    const props = {
      coordinates: null,
    }
    super(renderer, Component, props)

    pipe(
      coordinates,
      consume((c) => {
        props.coordinates = c
        this.render()
      }),
    )
  }
}

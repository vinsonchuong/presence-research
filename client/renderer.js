import {createRoot} from 'https://esm.sh/react-dom/client'
import {html} from 'https://esm.sh/htm/react'

export class Renderer {
  #renderables = new Map()
  #element = null

  constructor(element) {
    this.#element = element
  }

  render(renderable, reactElement) {
    if (this.#renderables.has(renderable)) {
      const {root} = this.#renderables.get(renderable)
      root.render(reactElement)
    } else {
      const element = document.createElement('div')
      this.#element.append(element)

      const root = createRoot(element)
      root.render(reactElement)

      this.#renderables.set(renderable, {root, element})
    }
  }

  remove(renderable) {
    const {root, element} = this.#renderables.get(renderable)
    root.unmount()
    element.remove()
    this.#renderables.delete(renderable)
  }
}

export class Renderable {
  #renderer
  #component
  #props

  constructor(renderer, component, props) {
    this.#renderer = renderer
    this.#component = component ?? (() => null)
    this.#props = props ?? {}
  }

  render() {
    this.#renderer.render(this, html`<${this.#component} ...${this.#props} />`)
  }

  remove() {
    this.#renderer.remove(this)
  }
}

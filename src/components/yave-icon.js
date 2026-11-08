import { LitElement, html, css } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { iconMarkup } from '../icons.js';

export class YaveIcon extends LitElement {
  static properties = {
    name: { type: String },
    size: { type: Number },
    label: { type: String },
  };

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
      width: 1em;
      height: 1em;
      vertical-align: -0.125em;
      color: currentColor;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.name = 'circle-help';
    this.size = 16;
    this.label = '';
  }

  updated(changed) {
    if (changed.has('size')) this.style.fontSize = `${this.size || 16}px`;
    if (changed.has('label')) {
      const svg = this.renderRoot.querySelector('svg');
      if (!svg) return;
      if (this.label) {
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', this.label);
        svg.removeAttribute('aria-hidden');
      } else {
        svg.setAttribute('aria-hidden', 'true');
        svg.removeAttribute('role');
        svg.removeAttribute('aria-label');
      }
    }
  }

  render() {
    return html`<svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >${unsafeSVG(iconMarkup(this.name || 'circle-help'))}</svg>`;
  }
}

if (!customElements.get('yave-icon')) customElements.define('yave-icon', YaveIcon);

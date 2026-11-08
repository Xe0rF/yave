import { LitElement, html } from 'lit';

function parseEr(text) {
  const entities = [];
  const relations = [];
  for (const raw of String(text).split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.includes('->')) {
      const [left, right] = line.split('->');
      const from = (left || '').trim();
      const rightText = (right || '').trim();
      const colon = rightText.indexOf(':');
      const target = (colon >= 0 ? rightText.slice(0, colon) : rightText).trim();
      const label = (colon >= 0 ? rightText.slice(colon + 1) : '').trim();
      if (from && target) relations.push({ from, to: target, label });
      continue;
    }
    const colon = line.indexOf(':');
    if (colon > 0) {
      const name = line.slice(0, colon).trim();
      const fields = line.slice(colon + 1).split(',').map(s => s.trim()).filter(Boolean);
      if (name) entities.push({ name, fields });
    }
  }
  return { entities, relations };
}

export class YaveEr extends LitElement {
  static properties = {
    _model: { state: true },
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    this._model = parseEr(this.textContent || '');
    this.textContent = '';
    super.connectedCallback();
  }

  render() {
    const { entities, relations } = this._model || { entities: [], relations: [] };
    return html`
      <div class="yave-er">
        <div class="yave-er-grid">
          ${entities.map(e => html`
            <div class="yave-er-entity">
              <b>${e.name}</b>
              ${e.fields.map(f => html`<div class="yave-er-field"><span>${f}</span></div>`)}
            </div>
          `)}
        </div>
        ${relations.length ? html`
          <div class="yave-er-rels">
            ${relations.map(r => html`
              <span class="yave-er-rel">
                <b>${r.from}</b> → <b>${r.to}</b>${r.label ? html`<span>${r.label}</span>` : null}
              </span>
            `)}
          </div>
        ` : null}
      </div>
    `;
  }
}

if (!customElements.get('yave-er')) customElements.define('yave-er', YaveEr);

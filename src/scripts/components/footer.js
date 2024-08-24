class Footer extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
      display: block;
        text-transform: uppercase;
  background-color: #708871;
  padding: 20px;
  height: 150px;
  display: flex;
  justify-content: start;
  color: white;
  font-size: 1rem;
      }
 
      footer {
        padding: 24px 20px;
 
        text-align: center;
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `      
      <footer>
       <slot></slot>
      </footer>
    `;
  }
}

customElements.define("footer-bar", Footer);

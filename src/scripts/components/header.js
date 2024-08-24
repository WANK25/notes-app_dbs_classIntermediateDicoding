class Header extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _bgcolor = "white";

  static get observedAttributes() {
    return ["bg-color"];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  connectedCallback() {
    this.render();
  }

  set bgcolor(value) {
    this.setAttribute("bg-color", value);
  }

  get bgcolor() {
    return this.getAttribute("bg-color");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        background-color: ${this._bgcolor};
        padding: 20px;
        max-height: 100px;
        display: flex;
        justify-content: center;
        color: #606676;
        font-size: 2.5rem;
        text-transform: uppercase;
      }

      h1 {
        color: #606676;
        font-size: 2.5rem;
        text-transform: uppercase;
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    const headerElement = document.createElement("header");
    const h1Element = document.createElement("h1");
    h1Element.textContent = "notes-app";

    headerElement.appendChild(h1Element);
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.appendChild(headerElement);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "bg-color" && newValue !== oldValue) {
      this._bgcolor = newValue;
      this.render();
    }
  }
}

customElements.define("header-bar", Header);

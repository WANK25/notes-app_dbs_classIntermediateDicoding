class CustomButton extends HTMLElement {
  static observedAttributes = ["type", "label"];
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.innerHTML = `
      <style>
        button {
          padding: 5px 10px;
          font-size: 1rem;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
          margin: 5px;
        }

        button.delete {
          background-color: #f44336;
          color: white;
        }

        button.arsip {
          background-color: #4caf50;
          color: white;
        }

        button.edit {
          background-color: #2196F3;
          color: white;
        }
      </style>
      <button class="${this.getAttribute("type")}">${this.getAttribute("label")}</button>
    `;
  }

  connectedCallback() {
    this._shadowRoot.querySelector("button").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent(this.getAttribute("type") + "-note", {
          detail: { id: this.getAttribute("note-id") },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
}

customElements.define("custom-button", CustomButton);

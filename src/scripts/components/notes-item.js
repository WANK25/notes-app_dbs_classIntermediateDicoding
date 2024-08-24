class NotesItem extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
    this._notes = {
      id: null,
      title: null,
      body: null,
    };
  }

  set notes(value) {
    this._notes = value;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="notes-item">
        <h1>${this._notes.title}</h1>
        <p>${this._notes.body}</p>
        <button class="button-delete" id="${this._notes.id}">Hapus</button>
        <button class="button-arsip" id="${this._notes.id}">Arsipkan</button>

      </div>
    `;

    this._shadowRoot
      .querySelector(".button-delete")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-note", {
            detail: { id: this._notes.id },
            bubbles: true,
            composed: true,
          }),
        );
      });

    // Pisahkan pemanggilan untuk .button-arsip
    this._shadowRoot
      .querySelector(".button-arsip")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("arsip-note", {
            detail: { id: this._notes.id },
            bubbles: true,
            composed: true,
          }),
        );
      });
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
        overflow: hidden;    
        background-color: #606676;
        color: white;
        font-family: sans-serif;
      }

      h1 {
        font-size:         font-size: 2rem;
;
      }

      p {
        font-size: 1rem;
      }

      .notes-item {
        padding: 10px;
      }

      .notes-item h1 { 
        color: #fef3e2;
      }
        .button-delete{
          padding-inline: 10px;
          padding-block: 5px;
          border: none;
          color: black;
          border-radius: 5px;
          padding: 10px;

        }

        .button-arsip{
          padding-inline: 10px;
          padding-block: 5px;
          border: none;
          color: black;
          border-radius: 5px;
          padding: 10px;

        }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }
}

customElements.define("notes-item", NotesItem);

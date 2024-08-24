class NotesArchive extends HTMLElement {
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
        <button class="button-pulih" id="${this._notes.id}">Pulihkan</button>

      </div>
    `;

    this._shadowRoot
      .querySelector(".button-pulih")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("pulih-note", {
            detail: { id: this._notes.id },
            bubbles: true,
            composed: true,
          }),
        );
      });

    // Pisahkan pemanggilan untuk .button-arsip
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        border: 3px solid black;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
        overflow: hidden;    
        background-color: transparent;
        color: black;
        font-family: sans-serif;
        
      }

      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }

      .notes-item {
        padding: 10px;
      }

      .notes-item h1 { 
        color: black;
      }
        .button-pulih{
          padding-inline: 10px;
          padding-block: 5px;
          border: none;
          color: black;
          border-radius: 5px;
          padding: 10px;
          background-color: #606676;
          color: white;

        }

       
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }
}

customElements.define("notes-archive", NotesArchive);

export class UuidFormat extends HTMLElement {
  static get observedAttributes() {
    return ["uuid"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.uuidNode = document.createElement("span");
    this.shadowRoot.appendChild(this.uuidNode);
  }

  get uuid() {
    return this.getAttribute("uuid");
  }

  set uuid(uuid) {
    this.setAttribute("uuid", uuid);
  }

  attributeChangedCallback() {
    const uuid = this.uuid.replace(/-/g, "");

    if (uuid.length === 32) {
      this.uuidNode.textContent = `${uuid.slice(0, 8)}-${uuid.slice(
        8,
        12
      )}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20, 32)}`;
    } else {
      this.uuidNode.textContent = `???`;
    }
  }
}

customElements.define("uuid-format", UuidFormat);

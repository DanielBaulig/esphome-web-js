function splitEntityTypeAndSlug(id) {
  return id.split('-');
}
  
export default class Entity extends EventTarget {
  constructor(controller, data) {
    super();
    this.controller = controller;
    this.id = data.id;
    [this.type , this.slug] = splitEntityTypeAndSlug(data.id);
    this.data = data;
  }

  update(data) {
    this.data = data;
    this.dispatchEvent(new CustomEvent('update', { 
      detail: {
        entity: this
      }
    }));
  }

  async refresh() {
    return this.controller.get(this.getBaseURL());
  }

  getBaseURL() {
    return `/${this.type}/${this.slug}`;
  }

  getPostURL(action) {
    return `${this.getBaseURL()}/${action}`;
  }
}

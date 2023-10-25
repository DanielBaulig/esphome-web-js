function splitEntityTypeAndSlug(id) {
  return id.split('-');
}
  
export default class ESPHomeWebEntity extends EventTarget {
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

  getPostURL(action) {
    return `/${this.type}/${this.slug}/${action}`;
  }
}

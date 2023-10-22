function splitEntityTypeAndName(id) {
  return id.split('-');
}
  
export default class ESPHomeWebEntity extends EventTarget {
  constructor(controller, data) {
    super();
    this.controller = controller;
    this.id = data.id;
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
    const [type, name] = splitEntityTypeAndName(this.id);
    return `/${type}/${name}/${action}`;
  }
}

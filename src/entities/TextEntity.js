import Entity from '../Entity'

export default class TextEntity extends Entity {
  constructor(controller, data) {
    super(controller, data);
  }

  async set(value) {
    const query = {value};
    return this.controller.post(this.getPostURL('set'), query);
  }
}


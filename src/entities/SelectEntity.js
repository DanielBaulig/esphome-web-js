
import Entity from '../Entity'

export default class ButtonEntity extends Entity {
  constructor(controller, data) {
    super(controller, data);
  }

  async set(option) {
    const query = { option };
    return this.controller.post(this.getPostURL('set'), query);
  }
}

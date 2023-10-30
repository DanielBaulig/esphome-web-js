import Entity from '../Entity'

export default class ButtonEntity extends Entity {
  constructor(controller, data) {
    super(controller, data);
  }

  async press() {
    return this.controller.post(this.getPostURL('press'));
  }
}

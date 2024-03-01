import Entity from '../Entity';

export default class LockEntity extends Entity {
  constructor(controller, data) {
    super(controller, data);
  }

  async open() {
    return this.controller.post(this.getPostURL('open'));
  }

  async lock() {
    return this.controller.post(this.getPostURL('lock'));
  }

  async unlock() {
    return this.controller.post(this.getPostURL('unlock'));
  }
}

import ESPHomeWebEntity from '../ESPHomeWebEntity';

export default class ESPHomeWebSwitchEntity extends ESPHomeWebEntity {
  constructor(controller, data) {
    super(controller, data);
  }

  async turnOn() {
    this.controller.post(this.getPostURL('turn_on'));
  }

  async turnOff() {
    this.controller.post(this.getPostURL('turn_off'));
  }

  async toggle() {
    this.controller.post(this.getPostURL('toggle'));
  }
}
